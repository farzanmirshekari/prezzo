package main

import (
	"fmt"
	"image/color"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/muesli/gamut"
)

type raw_content struct {
	Text_Content string `json:"text_content"`
	UUID         string `json:"presentation_uuid"`
}

type styles struct {
	BackgroundColor string `json:"background_color"`
	TextColor       string `json:"text_color"`
	FontFace        string `json:"font_face"`
}

type slide struct {
	Index  int    `json:"index"`
	Header string `json:"header"`
	Body   string `json:"body"`
	Image  string `json:"image"`
	Styles styles `json:"styles"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var presentation_uuid string
var images_map map[string]string = make(map[string]string)

func main() {
	router := gin.Default()
	session := initialize_S3()
	router.Use(CORS_middleware())
	router.Use(func(c *gin.Context) {
		c.Set("session", session)
		c.Next()
	})
	router.GET("/presentation_content", parse_presentation_content)
	router.GET("/existing_presentation", get_existing_presentation)
	router.POST("/image_upload", upload_image_to_S3)
	router.Run("localhost:8080")
}

func get_existing_presentation(c *gin.Context) {
	existing_presentation_uuid := c.Query("presentation_uuid")
	c.JSON(http.StatusOK, gin.H{"presentation": load_presentation_from_S3(existing_presentation_uuid, c)})
}

func parse_presentation_content(c *gin.Context) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ws.Close()
	for {
		var presentation_content raw_content
		err := ws.ReadJSON(&presentation_content)
		if err != nil {
			break
		}
		slides := split_into_slides(&presentation_content, c)
		err = ws.WriteJSON(slides)
		if err != nil {
			break
		}
	}
}

func get_background_colors(presentation_content raw_content, slides_count int) []color.Color {
	background_color_scheme_regex := regexp.MustCompile(`color-scheme:\s*(.*?)\s*;`)
	color_scheme := filter_string_by_regex(presentation_content.Text_Content, background_color_scheme_regex)
	if color_scheme == "" {
		color_scheme = "#427ef5 tint"
	}
	color_scheme_split := strings.Split(color_scheme, " ")
	if len(color_scheme_split) < 2 {
		color_scheme_split = append(color_scheme_split, "")
	}
	color_scheme_color := color_scheme_split[0]
	color_scheme_progression := color_scheme_split[1]
	if color_scheme_progression == "tint" {
		return gamut.Tints(gamut.Hex(color_scheme_color), slides_count*2)
	} else if color_scheme_progression == "shade" {
		return gamut.Shades(gamut.Hex(color_scheme_color), slides_count*2)
	} else if color_scheme_progression == "tone" {
		return gamut.Tones(gamut.Hex(color_scheme_color), slides_count*2)
	} else {
		return func() []color.Color {
			colors := make([]color.Color, slides_count*2)
			for i := range colors {
				colors[i] = gamut.Hex(color_scheme_color)
			}
			return colors
		}()
	}
}

func get_slide_text_color(slide *string, default_color string) string {
	text_color_regex := regexp.MustCompile(`text-color:\s*(.*?)\s*;`)
	text_color := filter_string_by_regex(purge_string(*slide, " "), text_color_regex)
	if text_color == "" {
		return default_color
	} else {
		*slide = purge_string(*slide, fmt.Sprintf("text-color: %s;", text_color))
		return text_color
	}
}

func get_slide_background_color(slide *string, default_color color.Color) color.Color {
	slide_background_color_regex := regexp.MustCompile(`background-color:\s*(.*?)\s*;`)
	slide_background_color := filter_string_by_regex(purge_string(*slide, " "), slide_background_color_regex)
	if slide_background_color == "" {
		return default_color
	} else {
		*slide = purge_string(*slide, fmt.Sprintf("background-color: %s;", slide_background_color))
		return gamut.Hex(slide_background_color)
	}
}

func split_into_slides(presentation_content *raw_content, c *gin.Context) []slide {

	if presentation_uuid != presentation_content.UUID {
		presentation_uuid = presentation_content.UUID
		images_map = make(map[string]string)
	}

	slide_delimiter := "---"
	header_delimiter := "#"
	body_delimiter := "~"
	font_face_regex := regexp.MustCompile(`font-face:\s*(.*?)\s*;`)
	image_name_regex := regexp.MustCompile(`/assets/\s*(.*?)\s*;`)

	slides := filter_string_by_delimiter(presentation_content.Text_Content, slide_delimiter)

	slide_background_colors := get_background_colors(*presentation_content, len(slides))

	font_face := filter_string_by_regex(purge_string(presentation_content.Text_Content, " "), font_face_regex)
	if font_face == "" {
		font_face = "Arial"
	}

	parsed_slides := make([]slide, len(slides))
	slides_headers := make([]string, len(slides))
	slides_body := make([]string, len(slides))
	slides_text_colors := make([]string, len(slides))
	slide_font_faces := make([]string, len(slides))
	slides_images := make([]string, len(slides))

	for i := range slides {
		slides_text_colors[i] = get_slide_text_color(&slides[i], "#000000")
		slide_font_faces[i] = font_face
		slide_background_colors[i] = get_slide_background_color(&slides[i], slide_background_colors[i])
		slides_headers[i] = validate_split_string(filter_string_by_delimiter(slides[i], header_delimiter))
		slides_body[i] = validate_split_string(filter_string_by_delimiter(slides[i], body_delimiter))
		slides_images[i] = generate_signed_url_from_S3(filter_string_by_regex(slides[i], image_name_regex), c)

		parsed_slides[i] = slide{
			Index:  i,
			Header: slides_headers[i],
			Body:   slides_body[i],
			Image:  slides_images[i],
			Styles: styles{
				BackgroundColor: gamut.ToHex(slide_background_colors[i]),
				TextColor:       slides_text_colors[i],
				FontFace:        slide_font_faces[i],
			},
		}
	}

	// save_presentation_to_S3(presentation_content, c)

	return parsed_slides
}

func CORS_middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH,OPTIONS,GET,PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

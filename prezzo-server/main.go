package main

import (
	"fmt"
	"net/http"
	"regexp"

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

func split_into_slides(presentation_content *raw_content, c *gin.Context) []slide {

	if presentation_uuid != presentation_content.UUID {
		presentation_uuid = presentation_content.UUID
		images_map = make(map[string]string)
	}

	slide_delimiter := "---"
	header_delimiter := "#"
	body_delimiter := "~"
	image_name_regex := regexp.MustCompile(`/assets/\s*(.*?)\s*;`)

	slides := filter_string_by_delimiter(presentation_content.Text_Content, slide_delimiter)

	slide_text_colors := get_text_colors(*presentation_content, len(slides))
	slide_background_colors := get_background_colors(*presentation_content, len(slides))
	slide_font_faces := get_font_faces(*presentation_content, len(slides))

	parsed_slides := make([]slide, len(slides))
	slides_headers := make([]string, len(slides))
	slides_body := make([]string, len(slides))
	slides_images := make([]string, len(slides))

	for i := range slides {
		slide_text_colors[i] = get_slide_text_color(&slides[i], slide_text_colors[i])
		slide_font_faces[i] = get_slide_font_face(&slides[i], slide_font_faces[i])
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
				TextColor:       slide_text_colors[i],
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

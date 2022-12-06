package main

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/muesli/gamut"
)

type raw_content struct {
	Text_Content string `json:"text_content"`
	UUID         string `json:"presentation_uuid"`
}

type styles struct {
	BackgroundColor string `json:"background_color"`
	TextColor       string `json:"text_color"`
}

type slide struct {
	Index  int    `json:"index"`
	Header string `json:"header"`
	Body   string `json:"body"`
	Image  string `json:"image"`
	Styles styles `json:"styles"`
}

func main() {
	router := gin.Default()
	session := initialize_S3()
	router.Use(CORS_middleware())
	router.Use(func(c *gin.Context) {
		c.Set("session", session)
		c.Next()
	})
	router.POST("/presentation_content", parse_presentation_content)
	router.POST("/image_upload", upload_image_to_S3)
	router.Run("localhost:8080")
}

func parse_presentation_content(c *gin.Context) {
	var presentation_content raw_content
	c.BindJSON(&presentation_content)
	slides := split_into_slides(&presentation_content, c)
	c.JSON(http.StatusOK, slides)
}

func split_into_slides(presentation_content *raw_content, c *gin.Context) []slide {
	slide_delimiter := "---"
	header_delimiter := "#"
	body_delimiter := "~"
	background_color_scheme_regex := regexp.MustCompile(`color-scheme:\s*(.*?)\s*;`)
	text_color_regex := regexp.MustCompile(`text-color:\s*(.*?)\s*;`)
	image_name_regex := regexp.MustCompile(`/assets/\s*(.*?)\s*;`)

	slides := filter_string_by_delimiter(presentation_content.Text_Content, slide_delimiter)
	color_scheme := filter_string_by_regex(purge_string(presentation_content.Text_Content, " "), background_color_scheme_regex)
	slide_background_colors := gamut.Tints(gamut.Hex(color_scheme), len(slides))

	parsed_slides := make([]slide, len(slides))
	slides_headers := make([]string, len(slides))
	slides_body := make([]string, len(slides))
	slide_text_colors := make([]string, len(slides))
	slide_images := make([]string, len(slides))

	for i := range slides {
		slide_text_colors[i] = filter_string_by_regex(purge_string(slides[i], " "), text_color_regex)
		slides[i] = purge_string(slides[i], slide_text_colors[i])
		slides_headers[i] = validate_split_string(filter_string_by_delimiter(slides[i], header_delimiter))
		slides_body[i] = validate_split_string(filter_string_by_delimiter(slides[i], body_delimiter))
		slide_images[i] = generate_signed_url_from_S3(presentation_content.UUID, filter_string_by_regex(slides[i], image_name_regex), c)

		parsed_slides[i] = slide{
			Index:  i,
			Header: slides_headers[i],
			Body:   slides_body[i],
			Image:  slide_images[i],
			Styles: styles{
				BackgroundColor: gamut.ToHex(slide_background_colors[i]),
				TextColor:       slide_text_colors[i],
			},
		}
	}
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

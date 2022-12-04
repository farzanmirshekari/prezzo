package main

import (
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/muesli/gamut"
)

type raw_content struct {
	Text_Content string `json:"text_content"`
}

type styles struct {
	BackgroundColor string `json:"background_color"`
	TextColor       string `json:"text_color"`
}

type slide struct {
	Index  int    `json:"index"`
	Header string `json:"header"`
	Body   string `json:"body"`
	Styles styles `json:"styles"`
}

func main() {
	router := gin.Default()
	router.Use(CORS_middleware())
	router.POST("/presentation_content", parse_presentation_content)
	router.Run("localhost:8080")
}

func parse_presentation_content(c *gin.Context) {
	var presentation_content raw_content
	c.BindJSON(&presentation_content)
	slides := split_into_slides(&presentation_content)
	c.JSON(http.StatusOK, slides)
}

func split_into_slides(presentation_content *raw_content) []slide {
	slide_delimiter := "---"
	header_delimiter := "#"
	body_delimiter := "~"
	background_color_scheme_regex := regexp.MustCompile(`color-scheme:\s*(.*?)\s*;`)
	text_color_regex := regexp.MustCompile(`text-color:\s*(.*?)\s*;`)

	slides := filter_string_by_delimiter(presentation_content.Text_Content, slide_delimiter)
	color_scheme := filter_string_by_regex(purge_string(presentation_content.Text_Content, " "), background_color_scheme_regex)
	slide_background_colors := gamut.Tints(gamut.Hex(color_scheme), len(slides))

	parsed_slides := make([]slide, len(slides))
	slides_headers := make([]string, len(slides))
	slides_body := make([]string, len(slides))
	slide_text_colors := make([]string, len(slides))

	for i := range slides {
		slide_text_colors[i] = filter_string_by_regex(purge_string(slides[i], " "), text_color_regex)
		slides[i] = purge_string(slides[i], slide_text_colors[i])
		slides_headers[i] = validate_split_string(filter_string_by_delimiter(slides[i], header_delimiter))
		slides_body[i] = validate_split_string(filter_string_by_delimiter(slides[i], body_delimiter))
		parsed_slides[i] = slide{
			Index:  i,
			Header: slides_headers[i],
			Body:   slides_body[i],
			Styles: styles{
				BackgroundColor: gamut.ToHex(slide_background_colors[i]),
				TextColor:       slide_text_colors[i],
			},
		}
	}
	return parsed_slides
}

func filter_string_by_delimiter(s string, delimiter string) []string {
	split_string := strings.Split(s, delimiter)
	if len(split_string) == 1 {
		return []string{}
	}
	return split_string[1 : len(split_string)-1]
}

func validate_split_string(s []string) string {
	if len(s) == 0 {
		return ""
	}
	return s[0]
}

func filter_string_by_regex(s string, regex *regexp.Regexp) string {
	filtered_string := regex.FindAllStringSubmatch(s, -1)
	if len(filtered_string) == 0 {
		return ""
	}
	return filtered_string[0][1]
}

func purge_string(s string, to_cut string) string {
	return strings.ReplaceAll(s, to_cut, "")
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

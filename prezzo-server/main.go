package main

import (
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
)

type raw_content struct {
	Text_Content string `json:"text_content"`
}

type slide struct {
	Index  int    `json:"index"`
	Header string `json:"header"`
	Body   string `json:"body"`
}

func main() {
	router := gin.Default()
	router.Use(CORS_middleware())
	router.GET("/", deliver_message)
	router.POST("/presentation_content", parse_presentation_content)
	router.Run("localhost:8080")
}

func deliver_message(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Prezzo server..",
	})
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
	slides := filter_string_by_delimiter(presentation_content.Text_Content, slide_delimiter)
	slides_headers := make([]string, len(slides))
	slides_body := make([]string, len(slides))
	parsed_slides := make([]slide, len(slides))
	for i := range slides {
		slides_headers[i] = filter_string_by_delimiter(slides[i], header_delimiter)[0]
		slides_body[i] = filter_string_by_delimiter(slides[i], body_delimiter)[0]
		parsed_slides[i] = slide{
			Index:  i,
			Header: slides_headers[i],
			Body:   slides_body[i],
		}
	}
	return parsed_slides
}

func filter_string_by_delimiter(s string, delimiter string) []string {
	split_string := strings.Split(s, delimiter)
	if len(split_string) == 1 {
		return nil
	}
	return split_string[1 : len(split_string)-1]
}

func filter_string_by_regex(s string, regex *regexp.Regexp) [][]string {
	return regex.FindAllStringSubmatch(s, -1)
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

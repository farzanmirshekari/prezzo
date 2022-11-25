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
	Index int    `json:"index"`
	Title string `json:"title"`
	Body  string `json:"body"`
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
	title_delimiter := "##"
	body_delimiter_regex := regexp.MustCompile(`<-\s*(.*?)\s*->`)
	slides_body_array := filter_string_by_delimiter(presentation_content.Text_Content, slide_delimiter)
	slides_titles := make([]string, len(slides_body_array))
	slides_body := make([]string, len(slides_body_array))
	slides := make([]slide, len(slides_body_array))
	for i := range slides_body_array {
		slides_titles[i] = filter_string_by_delimiter(slides_body_array[i], title_delimiter)[0]
		slides_body[i] = filter_string_by_regex(slides_body_array[i], body_delimiter_regex)[0][1]
		slides[i] = slide{
			Index: i,
			Title: slides_titles[i],
			Body:  slides_body[i],
		}
	}
	return slides
}

func filter_string_by_delimiter(s string, delimiter string) []string {
	split_string := strings.Split(s, delimiter)
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

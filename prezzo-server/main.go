package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type raw_content struct {
	Text_Content string `json:"text_content"`
}

type slide struct {
	Index   int                `json:"index"`
	Content slide_text_content `json:"content"`
}

type slide_text_content struct {
	Text_Content string `json:"text_content"`
}

func main() {
	router := gin.Default()
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
	c.JSON(http.StatusOK, gin.H{
		"content": presentation_content,
		"status":  "OK",
	})
}

func split_into_slides(presentation_content *raw_content) {
	// TODO
}

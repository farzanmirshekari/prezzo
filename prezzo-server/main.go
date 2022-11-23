package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type slide struct {
	Index   int                `json:"index"`
	Content slide_text_content `json:"content"`
}

type slide_text_content struct {
	Text_Content []string `json:"text_content"`
}

func main() {
	router := gin.Default()
	router.GET("/", deliver_message)
	router.Run("localhost:8080")
}

func deliver_message(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Prezzo server..",
	})
}

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func initialize_S3() *session.Session {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("error loading .env file..")
	}
	access_key_id := os.Getenv("AWS_ACCESS_KEY_ID")
	secret_access_key := os.Getenv("AWS_SECRET_ACCESS_KEY")
	region := os.Getenv("AWS_REGION")

	session, err := session.NewSession(&aws.Config{
		Region:      aws.String(region),
		Credentials: credentials.NewStaticCredentials(access_key_id, secret_access_key, ""),
	})
	if err != nil {
		fmt.Println(err)
	}
	return session
}

func upload_image_to_S3(c *gin.Context) {
	session := c.MustGet("session").(*session.Session)
	uploader := s3manager.NewUploader(session)

	bucket := os.Getenv("AWS_BUCKET_NAME")

	file, header, err := c.Request.FormFile("image")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	file_name := header.Filename

	upload, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(file_name),
		Body:   file,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message":  err.Error(),
			"uploader": upload,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "success",
		"uploader": upload,
	})
}

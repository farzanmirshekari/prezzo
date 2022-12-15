package main

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/gin-gonic/gin"
	"github.com/goccy/go-json"
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
	presentation_uuid := c.Request.FormValue("presentation_uuid")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	file_name := header.Filename

	upload, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(presentation_uuid + "/" + file_name),
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

func save_presentation_to_S3(presentation_content *raw_content) {
	session := initialize_S3()
	uploader := s3manager.NewUploader(session)
	bucket := os.Getenv("AWS_BUCKET_NAME")

	presentation_content_json, err := json.Marshal(presentation_content)

	if err != nil {
		return
	}

	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(presentation_content.UUID + "/presentation.json"),
		Body:   bytes.NewReader(presentation_content_json),
	})

	if err != nil {
		return
	}
}

func load_presentation_from_S3(existing_presentation_ID string, presentation_content *raw_content) {
	session := initialize_S3()
	service_client := s3.New(session)

	_, err := service_client.HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(existing_presentation_ID + "/presentation.json"),
	})

	if err != nil {
		presentation_content.Text_Content = ""
	}

	result, err := service_client.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(existing_presentation_ID + "/presentation.json"),
	})

	if err != nil {
		presentation_content.Text_Content = ""
	}

	buffer := new(bytes.Buffer)
	buffer.ReadFrom(result.Body)
	buffer_string := buffer.String()

	var content raw_content
	err = json.Unmarshal([]byte(buffer_string), &content)

	if err != nil {
		presentation_content.Text_Content = ""
	}

	presentation_content.UUID = content.UUID
	presentation_content.Text_Content = content.Text_Content
}

func generate_signed_url_from_S3(file_name string) string {

	if (presentation_uuid == "") || (file_name == "") {
		return ""
	}

	if url, ok := images_map[file_name]; ok && check_if_signed_url_is_valid(url) {
		return url
	}

	session := initialize_S3()
	service_client := s3.New(session)

	_, err := service_client.HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(presentation_uuid + "/" + file_name),
	})

	if err != nil {
		return ""
	}

	request, _ := service_client.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(presentation_uuid + "/" + file_name),
	})

	url, err := request.Presign(15 * 60 * time.Second)

	if err != nil {
		return ""
	}

	images_map[file_name] = url

	return url
}

func check_if_signed_url_is_valid(signed_url string) bool {
	url_expiry_regex := regexp.MustCompile(`&X-Amz-Date=\s*(.*?)\s*&`)
	url_expirty_ISO8601 := filter_string_by_regex(signed_url, url_expiry_regex)
	url_expiry_UTC, _ := time.Parse(time.RFC3339, url_expirty_ISO8601)
	url_expiry_UTC = url_expiry_UTC.UTC()
	return !time.Now().After(url_expiry_UTC)
}

package main

import (
	"context"
	"log"
	"os"

	client "cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

func initalize_firebase() *client.Client {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(".env file could not be loaded..")
	}
	context := context.Background()
	service_account := option.WithCredentialsFile(os.Getenv("SERVICE_ACCOUNT_JSON"))
	app, err := firebase.NewApp(context, nil, service_account)
	if err != nil {
		log.Fatalf("error initializing app.. %v", err)
	}
	client, err := app.Firestore(context)
	if err != nil {
		log.Fatalf("error initializing firestore client.. %v", err)
	}
	return client
}

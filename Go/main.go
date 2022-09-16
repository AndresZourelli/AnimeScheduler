package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/jackc/pgx/v4"
	"go.uber.org/zap"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "unable to connect to load environment variables: %v\n", err)
		os.Exit(1)
	}

	conn, err := pgx.Connect(context.Background(), os.Getenv("POSTGRES_DATABASE_URL_OWNER"))

	if err != nil {
		fmt.Fprintf(os.Stderr, "unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	defer conn.Close(context.Background())

	logger, err := zap.NewProduction()
	if err != nil {
		fmt.Fprintf(os.Stderr, "unable to load logger library: %v\n", err)
	}

	defer logger.Sync()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})
	http.ListenAndServe(":3000", r)
}

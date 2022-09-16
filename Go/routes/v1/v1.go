package v1

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func v1Router() http.Handler {
	r := chi.NewRouter()
	r.Mount("/animes", animeRouter())
	return r
}

func animesRouter() http.Handler {
	r := chi.NewRouter()
	r.Get("/", adminIndex)
	r.Get("/accounts", adminListAccounts)
	return r
}

func peoplesRouter() http.Handler {
	r := chi.NewRouter()
	r.Get("/", adminIndex)
	r.Get("/accounts", adminListAccounts)
	return r
}

func charactersRouter() http.Handler {
	r := chi.NewRouter()
	r.Get("/", adminIndex)
	r.Get("/accounts", adminListAccounts)
	return r
}

package app

import (
	"time"

	"github.com/google/uuid"
)

type BaseInfo struct {
	IsMain bool   `json:"isMain"`
	Name   string `json:"name"`
}

type Producer struct {
	BaseInfo
}

type Anime strucst {
	ID                     uuid.UUID  `json:"id"`
	MalId                  int        `json:"malId"`
	Title                  string     `json:"title"`
	Description            string     `json:"description"`
	NumberOfEpisodes       int        `json:"numberOfEpisodes"`
	Duration               int        `json:"duration"`
	AverageScore           float32    `json:"averageScore"`
	StartBroadcastDatetime time.Time  `json:"startBroadcastDatetime"`
	EndBroadcastDatetime   time.Time  `json:"endBroadcastDatetime"`
	CoverImage             string     `json:"coverImage"`
	AiringStatus           string     `json:"airingStatus"`
	MediaType              string     `json:"mediaType"`
	Season                 string     `json:"season"`
	SourceMaterial         string     `json:"sourceMaterial"`
	AgeRating              string     `json:"ageRating"`
	AlternateName          []string   `json:"alternateName"`
	Genres                 []string   `json:"genres"`
	Producers              []Producer `json:"producers"`
}

type Character struct {
}

type Person struct {
}

type AnimeService interface {
}

type CharacterService interface {
}

type PersonService interface {
}

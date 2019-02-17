package models

import (
	"time"
	"fmt"
	"github.com/cworsnup13/golang-gin/helpers"
	"log"
)

const (
	eventConfigPath = "/tmp/test_event.yaml"
)

var globalEvents *EventsData

type EventsData struct {
	Events []Event `json:"events" yaml:"events"`
}

type Event struct {
	Title      string    `json:"title" yaml:"title"`
	Start      time.Time `json:"start" yaml:"start"`
	End        time.Time `json:"end" yaml:"end"`
	GuestTypes []string  `json:"guestTypes" yaml:"guestTypes"`
}

func GetAllEvents() *EventsData {
	// load once
	if globalEvents == nil {
		fmt.Println("loaded events once")
		g := EventsData{}
		err := helpers.LoadYamlToCache(eventConfigPath, &g)
		if err != nil {
			log.Fatal(err)
		}
		globalEvents = &g
	}

	return globalEvents
}

func GetGuestEvents(guestType string) *EventsData {
	g := GetAllEvents()
	var guestEvents = make([]Event, 0)
	for _, v := range g.Events {
		for _, t := range v.GuestTypes {
			if t == guestType {
				guestEvents = append(guestEvents, v)
			}
		}
	}
	g2 := EventsData{guestEvents}
	return &g2
}
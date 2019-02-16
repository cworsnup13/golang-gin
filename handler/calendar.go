package handler

import (
	"github.com/gin-gonic/gin"
	"time"
	"net/http"
	"fmt"
)

const dateFormat = "2006-01-02T15:04:05Z"

//events: [
//    {
//      title: 'Event Title1',
//      start: '2015-03-17T13:13:55.008',
//      end: '2015-03-19T13:13:55.008'
//    },
//    {
//      title: 'Event Title2',
//      start: '2015-03-17T13:13:55-0400',
//      end: '2015-03-19T13:13:55-0400'
//    }
//  ]

type Event struct {
	Title string `json:"title"`
	Start time.Time `json:"start"`
	End time.Time `json:"end"`
}

type EventsData struct {
	Events []Event `json:"events"`
}

func getCalendarData(g *GuestType) EventsData {
	return EventsData{
		[]Event{
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
			{
				"THIS IS MY REALLY LONG EVENT NAME",
				time.Date(2019,2, 17,0,0,0,0, time.UTC),
				time.Date(2019,2, 18,0,0,0,0, time.UTC),
			},
		},
	}
}

func CalendarHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	val := c.PostForm("password")
	g := CheckPassword(val)
	if g == nil {
		c.AbortWithError(http.StatusUnauthorized, fmt.Errorf("not correct"))
	}
	events := getCalendarData(g)
	c.JSON(http.StatusOK, events)
}
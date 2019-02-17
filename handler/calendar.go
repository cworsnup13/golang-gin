package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"fmt"
	"github.com/cworsnup13/golang-gin/models"
)

const dateFormat = "2006-01-02T15:04:05Z"

func CalendarHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	val := c.PostForm("password")
	g := CheckPassword(val)
	if g == nil {
		c.AbortWithError(http.StatusUnauthorized, fmt.Errorf("not correct"))
	}
	events := models.GetGuestEvents(g.GuestType)
	c.JSON(http.StatusOK, events)
}

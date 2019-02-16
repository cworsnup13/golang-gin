package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"fmt"
)

const (
	// TODO REPLACE WHEN TESTING COMPLETE
	adminPassword        = "admin"
	weddingPartyPassword = "party"
	guestPassword        = "guest"
)

var GuestTypes = createGuestTypes()

type GuestType struct {
	GuestType  string `json:"guestType"`
	Password string
	Valid bool   `json:"valid"`
}

// createGuestTypes can create the types from a yaml.
func createGuestTypes() []GuestType {
	var types = make([]GuestType, 3)
	types[0] = GuestType{"admin", adminPassword, true}
	types[1] = GuestType{"Wedding Party", weddingPartyPassword, true}
	types[2] = GuestType{"Wedding Guest", guestPassword, true}
	return types
}

func CheckPassword(password string) *GuestType {
	for _, g := range GuestTypes {
		if password == g.Password {
			return &g
		}
	}
	return nil
}

func PasswordHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	val := c.PostForm("password")
	g := CheckPassword(val)
	if g == nil {
		c.AbortWithError(http.StatusUnauthorized, fmt.Errorf("not correct"))
		return
	}
	c.JSON(http.StatusOK, g)
}

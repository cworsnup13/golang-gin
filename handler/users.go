package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"fmt"

	"github.com/cworsnup13/golang-gin/models"
)

func CheckPassword(password string) *models.GuestType {
	for _, g := range models.GetAllGuestTypes().Types {
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

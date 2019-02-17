package models

import (
	"github.com/cworsnup13/golang-gin/helpers"
	"log"
	"fmt"
)

const (
	configPath = "/tmp/test.yaml"
)

var globalGuestTypes *GuestTypes

type GuestTypes struct {
	Types []GuestType `json:"guestTypes" yaml:"guestTypes"`
}

type GuestType struct {
	GuestType string `json:"guestType" yaml:"guestType"`
	Password  string `yaml:"password"`
}

func GetAllGuestTypes() *GuestTypes {
	// load once
	if globalGuestTypes == nil {
		fmt.Println("loaded once")
		g := GuestTypes{}
		err := helpers.LoadYamlToCache(configPath, &g)
		if err != nil {
			log.Fatal(err)
		}
		globalGuestTypes = &g
	}

	return globalGuestTypes
}

package helpers

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"fmt"
)

func LoadYamlToCache(filepath string, out interface{}) error {
	yamlFile, err := ioutil.ReadFile(filepath)
	if err != nil {
		return err
	}
	fmt.Println(string(yamlFile))

	err = yaml.Unmarshal(yamlFile, out)
	if err != nil {
		return err
	}
	return nil
}

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func main() {
	url := "https://learn.01founders.co/api/graphql-engine/v1/graphql"
	method := "POST"

	payload := strings.NewReader("{\"query\":\"{\\n  user(where:{login:{_eq:\\\"abmutungi\\\"}}){\\n    login\\n    transactions{\\n      object{\\n        name\\n      }\\n      amount\\n    }\\n  }\\n}\",\"variables\":{}}")

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(body))
}

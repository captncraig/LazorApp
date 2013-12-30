package main

import (
	"net/http"
	"github.com/captncraig/lazors"
	"fmt"
	"encoding/base64"
)
func main() {
    lazors.ClassicSetup()
	
	http.HandleFunc("/newGame",newGame)
	
	http.HandleFunc("/files/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.URL.Path[1:])
		http.ServeFile(w, r, r.URL.Path[1:])
	})
    panic(http.ListenAndServe(":17901", nil))
}

func newGame(w http.ResponseWriter, r *http.Request){
	board := lazors.ClassicSetup()
	str := base64.StdEncoding.EncodeToString(board[0:80])
	w.Write([]byte(str))
}




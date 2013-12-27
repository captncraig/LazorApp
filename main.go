package main

import (
	"net/http"
	"github.com/captncraig/lazors"
	"fmt"
	"os"
)
func main() {
	fmt.Println(os.Getwd())
    lazors.ClassicSetup()
	http.HandleFunc("/files/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.URL.Path[1:])
		http.ServeFile(w, r, r.URL.Path[1:])
	})
    panic(http.ListenAndServe(":17901", nil))
}




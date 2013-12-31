package main

import (
	"net/http"
	"github.com/captncraig/lazors"
	"fmt"
	"encoding/base64"
	"encoding/json"
)
func main() {
    lazors.ClassicSetup()
	
	http.HandleFunc("/newGame",newGame)
	http.HandleFunc("/path",getPath)
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("files/"+r.URL.Path[1:])
		http.ServeFile(w, r, "files/"+r.URL.Path[1:])
	})
    panic(http.ListenAndServe(":17901", nil))
}

func newGame(w http.ResponseWriter, r *http.Request){
	board := lazors.ClassicSetup()
	str := base64.StdEncoding.EncodeToString(board[0:80])
	w.Write([]byte(str))
}

func getPath(w http.ResponseWriter, r *http.Request){
	board := lazors.Board{}
	query := r.URL.Query().Get("brd")
	if query == ""{
		board = lazors.ClassicSetup()
	}else{
		decoded, _ :=  base64.StdEncoding.DecodeString(query)
		copy(board[:], decoded)
	}
	
	path := board.GetFullPath( 79, lazors.North)
	node := path.Front()
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("["))
	for ;node!=nil;node=node.Next(){
		seg := node.Value.(*lazors.PathSegment)
		b,_ := json.Marshal(seg)
		w.Write(b)
		if node.Next() != nil{w.Write([]byte(","))}
	}
	w.Write([]byte("]"))
}




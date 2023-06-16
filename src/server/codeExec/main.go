package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jorgedel4/iCode/packages/exec"
)

func main() {
	curDir, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}

	// Loading env variables (.env file)
	err = godotenv.Load(curDir + "/codeExec/.env")
	if err != nil {
		log.Fatalf(err.Error(), err)
		return
	}

	// MySQL connection
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(icodedocker-database-1:%s)/%s?parseTime=true", os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_PORT"), os.Getenv("MYSQL_DBNAME")))
	if err != nil {
		log.Fatal("Error connecting to MySQL:", err)
	}

	// Creating router and defining routes
	r := mux.NewRouter()
	r.HandleFunc("/exec", exec.Code(db)).Methods("POST")

	log.Println("Starting CodeExec on port", os.Getenv("PORT"))

	// Start listening
	if err = http.ListenAndServe(os.Getenv("PORT"), r); err != nil {
		log.Fatalf("Error listening to port. %s", err.Error())
		return
	}
}

package main

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/read"
	"elPadrino/RIDDLE/packages/update"
	"elPadrino/RIDDLE/packages/write"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	curDir, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}

	// Loading env variables (.env file)
	err = godotenv.Load(curDir + "/riddle/.env")
	if err != nil {
		log.Fatalf(err.Error(), err)
		return
	}

	// MySQL connection
	mysqlDB, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(icodedocker-database-1:%s)/%s?parseTime=true", os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_PORT"), os.Getenv("MYSQL_DBNAME")))
	if err != nil {
		log.Fatal("Error connecting to MySQL:", err)
	}

	// Creating router and defining routing functions
	r := mux.NewRouter()

	//Read operations
	r.HandleFunc("/questions", read.Questions(mysqlDB)).Methods("GET")
	r.HandleFunc("/freemodequestion/{moduleID}", read.FreemodeQuestion(mysqlDB)).Methods("GET")
	r.HandleFunc("/studentprogress", read.StudentProgress(mysqlDB)).Methods("GET")

	//Write operations
	r.HandleFunc("/requestQuestion", write.RequestQuestion(mysqlDB)).Methods("POST")
	r.HandleFunc("/submitAttempt/{questionType}", write.SubmitAttempt(mysqlDB)).Methods("POST")

	//Update operations
	r.HandleFunc("/aproveQuestionRequest/{questionID}", update.UpdateStatus(mysqlDB)).Methods("PATCH")
	r.HandleFunc("/declineQuestionRequest/{questionID}", update.DeclineRequest(mysqlDB)).Methods("PATCH")

	//Check status and PORT
	log.Println("Starting RIDDLE on", os.Getenv("PORT"))
	err = http.ListenAndServe(os.Getenv("PORT"), r)
	if err != nil {
		log.Fatal(err)
		return
	}
}

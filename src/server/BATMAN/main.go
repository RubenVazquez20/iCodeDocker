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
	"github.com/jorgedel4/iCode/packages/create"
	"github.com/jorgedel4/iCode/packages/read"
	"github.com/jorgedel4/iCode/packages/remove"
	"github.com/jorgedel4/iCode/packages/update"
)

func main() {

	curDir, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}

	// Loading env variables (.env file)
	err = godotenv.Load(curDir + "/batman/.env")
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

	// Create operations
	r.HandleFunc("/registercampus", create.Campus(mysqlDB)).Methods("POST")
	r.HandleFunc("/enrollstudent", create.Enrollment(mysqlDB)).Methods("POST")
	r.HandleFunc("/registergroup", create.Group(mysqlDB)).Methods("POST")
	r.HandleFunc("/registerterm", create.Term(mysqlDB)).Methods("POST")
	r.HandleFunc("/createhw", create.Homework(mysqlDB)).Methods("POST")
	r.HandleFunc("/registeruser", create.User(mysqlDB)).Methods("POST")
	r.HandleFunc("/course", create.Course(mysqlDB)).Methods("POST")
	r.HandleFunc("/modules", create.Modules(mysqlDB)).Methods("POST")

	// Read operations
	r.HandleFunc("/courses", read.Courses(mysqlDB)).Methods("GET")
	r.HandleFunc("/enrolledstudents/{groupID}", read.EnrolledStudents(mysqlDB)).Methods("GET")
	r.HandleFunc("/groups", read.Groups(mysqlDB)).Methods("GET")
	r.HandleFunc("/homework", read.Homework(mysqlDB)).Methods("GET")
	r.HandleFunc("/questionrequests", read.QuestionReqs(mysqlDB)).Methods("GET")
	r.HandleFunc("/users", read.Users(mysqlDB)).Methods("GET")
	r.HandleFunc("/terms", read.Terms(mysqlDB)).Methods("GET")
	r.HandleFunc("/groupmodules/{groupID}", read.GroupModules(mysqlDB)).Methods("GET")
	r.HandleFunc("/coursemodules/{courseID}", read.CourseModules(mysqlDB)).Methods("GET")
	r.HandleFunc("/campus", read.Campus(mysqlDB)).Methods("GET")
	r.HandleFunc("/grouphwstatus/{groupID}", read.GroupHWStatus(mysqlDB)).Methods("GET")
	r.HandleFunc("/groupmodulestatus/{groupID}", read.GroupModuleStatus(mysqlDB)).Methods("GET")
	r.HandleFunc("/groupmodulefailurerate/{groupID}", read.GroupModFailureRate(mysqlDB)).Methods("GET")

	// Update operations
	r.HandleFunc("/togglemodulestate", update.ModuleStatus(mysqlDB)).Methods("PATCH")
	r.HandleFunc("/user/{userID}", update.User(mysqlDB)).Methods("PATCH")
	r.HandleFunc("/homework/{homeworkID}", update.Homework(mysqlDB)).Methods("PATCH")
	r.HandleFunc("/coursename", update.CourseName(mysqlDB)).Methods("PATCH")
	r.HandleFunc("/modulenquestions", update.ModuleNQuestions(mysqlDB)).Methods("PATCH")

	// Delete operations
	r.HandleFunc("/homework/{homeworkID}", remove.Homework(mysqlDB)).Methods("DELETE")
	r.HandleFunc("/user/{userID}", remove.User(mysqlDB)).Methods("DELETE")
	r.HandleFunc("/unenrollstudent", remove.Unenroll(mysqlDB)).Methods("DELETE")
	r.HandleFunc("/group/{groupID}", remove.Group(mysqlDB)).Methods("DELETE")
	r.HandleFunc("/course/{courseID}", remove.Course(mysqlDB)).Methods("DELETE")
	r.HandleFunc("/module/{moduleID}", remove.Module(mysqlDB)).Methods("DELETE")
	r.HandleFunc("/campus/{campusID}", remove.Campus(mysqlDB)).Methods("DELETE")

	log.Println("Starting BATMAN on", os.Getenv("PORT"))
	err = http.ListenAndServe(os.Getenv("PORT"), r)
	if err != nil {
		log.Fatal(err)
		return
	}
}

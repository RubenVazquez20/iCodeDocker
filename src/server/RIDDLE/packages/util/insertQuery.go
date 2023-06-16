package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"fmt"
	"net/http"
	"strings"
	"time"
)

func InsertQueryCodep(w http.ResponseWriter, req string, question structs.InfoStructCodep, stmt *sql.Stmt) error {
	//Generate Id_Question
	idQuestion, _ := GenerateID("CQ", 18)
	//Generate the time of submittion
	location, _ := time.LoadLocation("America/Mexico_City")
	now := time.Now().In(location)

	_, err := stmt.Exec(idQuestion, question.Module, question.QType, req, question.CreatedBy, now, "PEN")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		if strings.HasPrefix(err.Error(), "Error 1062 (23000): Duplicate entry") {
			http.Error(w, fmt.Sprintf("'%s' already existe in the questions", idQuestion), http.StatusConflict)
			return err
		} else if err.Error() == "Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`icode`.`questions`, CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `professors` (`nomina`) ON DELETE CASCADE)" {
			http.Error(w, fmt.Sprintf("The professor'%s' does not exist", question.CreatedBy), http.StatusBadRequest)
			return err
		} else if err.Error() == "Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`icode`.`questions`, CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`module`) REFERENCES `modules` (`id_module`) ON DELETE CASCADE)" {
			http.Error(w, fmt.Sprintf("Student '%s' does not exist", question.Module), http.StatusBadRequest)
			return err
		}
	}

	return err
}

func InsertQueryMulti(w http.ResponseWriter, req string, question structs.InfoStructMulti, stmt *sql.Stmt) error {
	//Generate Id_Question
	idQuestion, _ := GenerateID("CQ", 18)
	//Generate the time of submittion
	location, _ := time.LoadLocation("America/Mexico_City")
	now := time.Now().In(location)

	_, err := stmt.Exec(idQuestion, question.Module, question.QType, req, question.CreatedBy, now, "PEN")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		if strings.HasPrefix(err.Error(), "Error 1062 (23000): Duplicate entry") {
			http.Error(w, fmt.Sprintf("'%s' already existe in the questions", idQuestion), http.StatusConflict)
			return err
		} else if err.Error() == "Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`icode`.`questions`, CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `professors` (`nomina`) ON DELETE CASCADE)" {
			http.Error(w, fmt.Sprintf("The professor'%s' does not exist", question.CreatedBy), http.StatusBadRequest)
			return err
		} else if err.Error() == "Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`icode`.`questions`, CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`module`) REFERENCES `modules` (`id_module`) ON DELETE CASCADE)" {
			http.Error(w, fmt.Sprintf("Student '%s' does not exist", question.Module), http.StatusBadRequest)
			return err
		}
	}
	return err
}

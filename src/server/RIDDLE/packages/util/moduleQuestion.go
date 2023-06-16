package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"errors"
)

func ModuleQuestion(req structs.SelectQuestion, mysqlDB *sql.DB) (structs.ResultQuestion, error) {
	var question structs.ResultQuestion
	// Por alguna razon se tiene que sacar el ID primero, porque si se llama a la funcion desde el select a veces no da resultados
	var id string
	idQuery := `SELECT ModuleQuestionID(?, ?, ?)`
	err := mysqlDB.QueryRow(idQuery, req.Group, req.Assigment, req.Student).Scan(&id)
	if err != nil {
		return question, err
	}

	query := `SELECT id_question, q_type, info
	FROM questions
	WHERE id_question = ?`

	err = mysqlDB.QueryRow(query, id).Scan(&question.IdPregunta, &question.Type, &question.Info)
	if err != nil {
		return question, err
	}

	// No questions avaliable
	if question.IdPregunta == "" {
		return question, errors.New("no more questions available")
	}

	return question, nil
}
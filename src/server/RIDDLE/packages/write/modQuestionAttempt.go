package write

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"elPadrino/RIDDLE/packages/util"
	"time"
)

func modQuestAttempt(req structs.ModQuestAttempt, mysqlDB *sql.DB) error {
	//Format the time for the seconds
	tiempo, err := util.SecondsToTime(req.AttemptTime)
	if err != nil {
		return err
	}

	//Query de inserciona la base de datos
	baseQuery := "INSERT INTO questionAttempts(student, grupo, question, attempt_status, attempt_time, attempt_date) VALUES (?, ?, ?, ?, ?, ?)"

	//Prepara genera un puntero
	stmt, err := mysqlDB.Prepare(baseQuery)
	if err != nil {
		return err
	}
	defer stmt.Close()

	//Generate the time of submittion
	now := time.Now()

	_, err = stmt.Exec(req.Student, req.Group, req.IdQuestion, req.AttemptStatus, tiempo, now)
	if err != nil {
		return err
	}

	return nil
}

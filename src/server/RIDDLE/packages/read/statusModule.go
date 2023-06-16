package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"errors"
	"net/http"
)

func statusModule(mysqlDB *sql.DB, w http.ResponseWriter, r *http.Request) (structs.Progress, error) {
	var studentID, groupID, moduleID string
	studentID = r.URL.Query().Get("student")
	groupID = r.URL.Query().Get("group")
	moduleID = r.URL.Query().Get("assignment")

	if studentID == "" || groupID == "" || moduleID == "" {
		return structs.Progress{}, errors.New("missing arguments")
	}

	var progress structs.Progress

	// Needed questions
	neededQuery := `SELECT n_question
		FROM moduleConfigs
		WHERE module = ?
		AND grupo = ?`

	err := mysqlDB.QueryRow(neededQuery, moduleID, groupID).Scan(&progress.Needed)
	if err != nil {
		return structs.Progress{}, errors.New("internal error")
	}

	// Answered questions for that module
	answeredQuery := "SELECT successful_mod_attempts(?, ?, ?)"

	err = mysqlDB.QueryRow(answeredQuery, studentID, moduleID, groupID).Scan(&progress.Answered)
	if err != nil {
		return structs.Progress{}, errors.New("internal error")
	}

	return progress, nil
}
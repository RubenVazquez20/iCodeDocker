package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"errors"
	"net/http"
)

// Get the progress for a homework
func statusHomework(mysqlDB *sql.DB, w http.ResponseWriter, r *http.Request) (structs.Progress, error) {
	// Get the required variables from URL parameters
	var req structs.HomeworkCheck
	req.StudentID = r.URL.Query().Get("student")
	req.HomeworkID = r.URL.Query().Get("assignment")

	// Check if the required variables are provided
	if req.StudentID == "" || req.HomeworkID == "" {
		return structs.Progress{}, errors.New("missing arguments")
	}

	var progress structs.Progress
	query := `SELECT GetTotalQuestions(?, ?), GetCorrectQuestion(?, ?);`

	err := mysqlDB.QueryRow(query, req.StudentID, req.HomeworkID, req.StudentID, req.HomeworkID).Scan(&progress.Needed, &progress.Answered)
	if err != nil {
		return structs.Progress{}, errors.New("internal")
	}

	return progress, nil
}

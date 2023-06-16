package update

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
)

func CourseName(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.UpdateCourneNameReq
		if err = json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		if req.ID == "" || req.NewName == "" {
			http.Error(w, "Missing arguments in request's body", http.StatusBadRequest)
			return
		}

		query := "SELECT ChangeCourseName(?, ?)"

		var queryExitStatus int
		err = mysqlDB.QueryRow(query, req.ID, req.NewName).Scan(&queryExitStatus)
		if err != nil {
			http.Error(w, "Error updating course name", http.StatusInternalServerError)
			return
		}

		// 1 - name already exists
		if queryExitStatus == 1 {
			http.Error(w, fmt.Sprintf("Course with name '%s' already exists", req.NewName), http.StatusConflict)
			return
		}

		// 0 - everything ok, course name updated
		if queryExitStatus == 0 {
			w.WriteHeader(http.StatusOK)
			w.(http.Flusher).Flush()
			w.(http.CloseNotifier).CloseNotify()
		}
	}
}

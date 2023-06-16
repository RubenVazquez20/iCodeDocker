package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"net/http"
)

func StudentProgress(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		if r.URL.Query().Get("assignment") == "" {
			http.Error(w, "Missing arguments", http.StatusBadRequest)
			return
		}
		var progress structs.Progress
		var err error

		if r.URL.Query().Get("assignment")[0] == 'H' {
			progress, err = statusHomework(mysqlDB, w, r)
		} else if r.URL.Query().Get("assignment")[0] == 'M' {
			progress, err = statusModule(mysqlDB, w, r)
		}

		if err != nil {
			if err.Error() == "missing arguments" {
				http.Error(w, "Missing arguments", http.StatusBadRequest)
				return
			}
			if err.Error() == "internal" {
				http.Error(w, "Error retrieving progress", http.StatusInternalServerError)
				return
			}
		}

		progressJSON, err := json.Marshal(progress)
		if err != nil {
			http.Error(w, "Error retrieving progress", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(progressJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

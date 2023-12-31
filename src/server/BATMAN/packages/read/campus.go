package read

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
)

// Get all of the available campus
func Campus(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Query to select all existing courses
		query := "SELECT id_campus, name_campus FROM campus;"

		// Execute query
		rows, err := mysqlDB.Query(query)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		// Iterate over the returned courses and store them
		var results []structs.Campus
		for rows.Next() {
			var result structs.Campus
			if err = rows.Scan(&result.ID, &result.Name); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			results = append(results, result)
		}

		// Encode courses slice into JSON
		coursesJSON, err := json.Marshal(results)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		// Return response and close connection
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(coursesJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

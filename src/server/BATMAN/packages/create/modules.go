package create

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
	"github.com/jorgedel4/iCode/packages/util"
)

func Modules(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Read request body
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Cast into struct
		var req structs.NewModulesReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Call the MySQL function to insert the module
		query := "SELECT InsertModule(?, ?, ?)"

		tx, err := mysqlDB.Begin()
		if err != nil {
			http.Error(w, "Error adding modules", http.StatusInternalServerError)
			return
		}

		stmt, err := tx.Prepare(query)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error adding modules", http.StatusInternalServerError)
			return
		}

		var exitCode int
		for _, module := range req.Modules {
			// Generate ID for the Module
			moduleID, err := util.GenerateID("M", 19)
			if err != nil {
				http.Error(w, "Error adding modules", http.StatusInternalServerError)
				return
			}

			err = stmt.QueryRow(moduleID, req.Course, module).Scan(&exitCode)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Error adding modules", http.StatusInternalServerError)
				return
			}

			// duplicate module
			if exitCode == 1 {
				tx.Rollback()
				http.Error(w, fmt.Sprintf("Module with name '%s' already exists", module), http.StatusConflict)
				return
			}
		}

		err = tx.Commit()
		if err != nil {
			http.Error(w, "Error adding modules", http.StatusInternalServerError)
			return
		}

		// Send response and close connection
		w.WriteHeader(http.StatusCreated)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

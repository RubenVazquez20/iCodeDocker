package read

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func GroupModuleStatus(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		group := mux.Vars(r)["groupID"]
		if group == "" {
			http.Error(w, "Group not given", http.StatusBadRequest)
			return
		}

		var statusJSON string
		query := "SELECT GroupModulesStatus(?)"

		err := mysqlDB.QueryRow(query, group).Scan(&statusJSON)
		if err != nil {
			http.Error(w, "Error retrieving data", http.StatusInternalServerError)
			return
		}

		// Return response and close connection
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(statusJSON))
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

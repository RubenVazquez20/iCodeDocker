package update

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
)

func ModuleNQuestions(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.UpdateModuleNQuestionsReq
		if err = json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		if req.Group == "" || req.Module == "" {
			http.Error(w, "Missing arguments in request body", http.StatusBadRequest)
			return
		}

		query := `UPDATE moduleConfigs
		SET n_question = ?
		WHERE module = ?
		AND grupo = ?`

		_, err = mysqlDB.Exec(query, req.NQuestions, req.Module, req.Group)
		if err != nil {
			http.Error(w, "Error updating number of module questions", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

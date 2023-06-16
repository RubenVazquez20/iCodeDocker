package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func FreemodeQuestion(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		module := mux.Vars(r)["moduleID"]

		var id string
		idQuery := `SELECT RandomModeModuleQuestionID(?)`
		err := mysqlDB.QueryRow(idQuery, module).Scan(&id)
		if err != nil {
			http.Error(w, "Error retrieving question", http.StatusInternalServerError)
			return
		}

		query := `SELECT id_question, q_type, info
		FROM questions
		WHERE id_question = ?
		LIMIT 1`

		var question structs.ResultQuestion
		err = mysqlDB.QueryRow(query, id).Scan(&question.IdPregunta, &question.Type, &question.Info)
		if err != nil {
			http.Error(w, "Error retrieving question", http.StatusInternalServerError)
			return
		}

		if question.IdPregunta == "" {
			http.Error(w, "Error retrieving question", http.StatusInternalServerError)
			return
		}

		questionJSON, err := json.Marshal(question)
		if err != nil {
			http.Error(w, "Error retrieving question", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(questionJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

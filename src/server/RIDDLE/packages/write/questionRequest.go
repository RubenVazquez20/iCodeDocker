package write

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"elPadrino/RIDDLE/packages/util"
	"encoding/json"
	"io"
	"net/http"
)

/* Function to post questions */
func RequestQuestion(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		//Revisar el metodo
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		//Leer el body de la conexion
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		//Tomar del JSON la informacion
		var req []structs.RequestQuestion // recibe un solo string dentro de la estructura
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", "*")

		//Query de inserciona la base de datos
		baseQuery := "INSERT INTO questions(id_question,module, q_type, info, created_by, submittedOn, current_status) VALUES (?, ?, ?, ?, ?, ?, ?)"

		//Prepara genera un puntero para recorrido a base de datos
		stmt, err := mysqlDB.Prepare(baseQuery)
		if err != nil {
			http.Error(w, "Error preparing query", http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		//Recorrer cada elemento del arreglo de objetos JSON recibido desde Body
		for _, question := range req {

			//Recibo el tipo de pregunta desde el string
			tipo, _ := util.QType(w, question)

			// Primero diferenciar segun el tipo de la pregunta lo que voy a hacer en cada una para el contenido de Info
			if tipo == "codep" {
				//Esta funcion fracciona el string inicial en cada llave y ademas ejecuta la insercion
				err = util.GetInfoCodep(w, question.Info, stmt)
				if err != nil {
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
				}
			} else if tipo == "multi" {
				//Esta funcion fracciona el string inicial en cada llave y ademas ejecuta la insercion
				err = util.GetInfoMulti(w, question.Info, stmt)
				if err != nil {
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
				}

			} else {
				http.Error(w, "Tipo de pregunta no válido", http.StatusBadRequest)
				return
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}

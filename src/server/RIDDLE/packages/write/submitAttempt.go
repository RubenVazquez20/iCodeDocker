package write

import (
	"bytes"
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"elPadrino/RIDDLE/packages/util"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

func SubmitAttempt(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request", http.StatusBadRequest)
			return
		}

		questionType := mux.Vars(r)["questionType"]
		if questionType != "code" && questionType != "multipleChoice" {
			http.Error(w, "Invalid question type", http.StatusBadRequest)
			return
		}

		var req structs.SubmitAttemptReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request", http.StatusBadRequest)
			return
		}

		// Check for required arguments
		if req.QuestionID == "" || (req.Code == "" && req.Answers == nil) {
			http.Error(w, "Missing required argument(s)", http.StatusBadRequest)
			return
		}

		if questionType == "multipleChoice" {
			// Get question from DB
			var questionInfoJSON string
			var questionInfo structs.InfoStructMultiWithoutKeys
			questionQuery := `SELECT info
			FROM questions
			WHERE id_question = ?
			LIMIT 1`

			err = mysqlDB.QueryRow(questionQuery, req.QuestionID).Scan(&questionInfoJSON)
			if err != nil {
				http.Error(w, "Could not retrieve question from DB", http.StatusInternalServerError)
				return
			}

			err = json.Unmarshal([]byte(questionInfoJSON), &questionInfo)
			if err != nil {
				http.Error(w, "Could not retrieve question from DB", http.StatusInternalServerError)
				return
			}

			passed := util.GradeMultiChoice(questionInfo.Correct_option, req.Answers)
			var result structs.MultiChoiceResult
			result.Explanation = questionInfo.Explanation
			result.Passed = passed

			resultJSON, err := json.Marshal(result)
			if err != nil {
				http.Error(w, "Error creating response", http.StatusInternalServerError)
				return
			}

			// Not free mode, must register attempt
			if req.StudentID != "" && req.AssigmentID != "" {
				if req.AssigmentID[0] == 'H' {
					var attemptRegisterReq structs.HwQuestionAttempt
					if passed {
						attemptRegisterReq.AttemptStatus = "PAS"
					} else {
						attemptRegisterReq.AttemptStatus = "FAI"
					}

					attemptRegisterReq.AttemptTime = req.AttemptTime
					attemptRegisterReq.Homework = req.AssigmentID
					attemptRegisterReq.IdQuestion = req.QuestionID
					attemptRegisterReq.Student = req.StudentID

					err = hwQuestionAttempt(attemptRegisterReq, mysqlDB)
					if err != nil {
						http.Error(w, "Error registering attempt", http.StatusInternalServerError)
						return
					}
				} else if req.AssigmentID[0] == 'M' {
					var attemptRegisterReq structs.ModQuestAttempt
					attemptRegisterReq.Student = req.StudentID
					attemptRegisterReq.Group = req.GroupID
					attemptRegisterReq.IdQuestion = req.QuestionID
					if passed {
						attemptRegisterReq.AttemptStatus = "PAS"
					} else {
						attemptRegisterReq.AttemptStatus = "FAI"
					}
					attemptRegisterReq.AttemptTime = req.AttemptTime

					err = modQuestAttempt(attemptRegisterReq, mysqlDB)
					if err != nil {
						http.Error(w, "Error registering attempt", http.StatusInternalServerError)
						return
					}
				}
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write(resultJSON)
			w.(http.Flusher).Flush()

		} else if questionType == "code" {
			var codeExecReq structs.CodeExecReq
			codeExecReq.Code = req.Code
			codeExecReq.QuestionID = req.QuestionID

			jsonData, err := json.Marshal(codeExecReq)
			if err != nil {
				http.Error(w, "Error calling CodeExec", http.StatusInternalServerError)
				return
			}

			ceReq, err := http.NewRequest("POST", "http://localhost:8001/exec", bytes.NewBuffer(jsonData))
			if err != nil {
				http.Error(w, "Error calling CodeExec", http.StatusInternalServerError)
				return
			}

			ceReq.Header.Set("Content-Type", "application/json")

			client := &http.Client{}
			resp, err := client.Do(ceReq)
			if err != nil {
				http.Error(w, "Error calling CodeExec", http.StatusInternalServerError)
				return
			}
			defer resp.Body.Close()

			if resp.StatusCode != 200 {
				http.Error(w, "Error running CodeExec", http.StatusInternalServerError)
				return
			}

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				http.Error(w, "Error reading response from CodeExec", http.StatusInternalServerError)
				return
			}

			var ceResponse structs.CodeExecResponse
			err = json.Unmarshal(body, &ceResponse)
			if err != nil {
				http.Error(w, "yeah.", http.StatusInternalServerError)
				return
			}

			if req.StudentID != "" && req.AssigmentID != ""{
				if req.AssigmentID[0] == 'H' {
					var attemptRegisterReq structs.HwQuestionAttempt
					if ceResponse.Passed {
						attemptRegisterReq.AttemptStatus = "PAS"
					} else {
						attemptRegisterReq.AttemptStatus = "FAI"
					}

					attemptRegisterReq.AttemptTime = req.AttemptTime
					attemptRegisterReq.Homework = req.AssigmentID
					attemptRegisterReq.IdQuestion = req.QuestionID
					attemptRegisterReq.Student = req.StudentID

					err = hwQuestionAttempt(attemptRegisterReq, mysqlDB)
					if err != nil {
						http.Error(w, "Error registering attempt", http.StatusInternalServerError)
						return
					}
				} else if req.AssigmentID[0] == 'M' {
					var attemptRegisterReq structs.ModQuestAttempt
					attemptRegisterReq.Student = req.StudentID
					attemptRegisterReq.Group = req.GroupID
					attemptRegisterReq.IdQuestion = req.QuestionID
					if ceResponse.Passed {
						attemptRegisterReq.AttemptStatus = "PAS"
					} else {
						attemptRegisterReq.AttemptStatus = "FAI"
					}
					attemptRegisterReq.AttemptTime = req.AttemptTime

					err = modQuestAttempt(attemptRegisterReq, mysqlDB)
					if err != nil {
						http.Error(w, "Error registering attempt", http.StatusInternalServerError)
						return
					}
				}
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write(body)
			w.(http.Flusher).Flush()
		}
	}
}

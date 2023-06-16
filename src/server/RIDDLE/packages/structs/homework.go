package structs

type HwQuestionAttempt struct {
	Student       string `json:"student"`
	Homework      string `json:"homework"`
	IdQuestion    string `json:"question"`
	AttemptStatus string `json:"attempt_status"`
	AttemptTime   int64  `json:"attempt_time"`
}

type HomeworkCheck struct {
	HomeworkID string
	StudentID  string
}

package structs

type SelectQuestion struct {
	Student   string
	Assigment string
	Group     string
}

type ResultQuestion struct {
	IdPregunta string `json:"id_pregunta"`
	Type       string `json:"type"`
	Info       string `json:"info"`
}

type ModQuestAttempt struct {
	Student       string `json:"student"`
	Group         string `json:"grupo"`
	IdQuestion    string `json:"question"`
	AttemptStatus string `json:"attempt_status"`
	AttemptTime   int64  `json:"attempt_time"`
}

// estructura que recibe la info global
type RequestQuestion struct {
	/* IdQuestion  = con la idgenerator lo agrego*/
	Info string `json:"info"`
	/* SubmittedOn agrego el tiempo en el que se agrega realmente */
	/* CurrentStatus = a todos se les da PEN por default */
}

// struct para tomar todos los valores de codep
type InfoStructCodep struct {
	Module             string     `json:"module"`
	QType              string     `json:"q_type"`
	Description        string     `json:"description"`
	Hinputs            [][]string `json:"hinputs"`
	Houtputs           []string   `json:"houtputs"`
	Sinputs            [][]string `json:"sinputs"`
	Soutputs           []string   `json:"soutputs"`
	TimeoutSec         int        `json:"timeoutSec"`
	ForbiddenFunctions []string   `json:"forbiddenFunctions"`
	InitialCode        string     `json:"initialCode"`
	Language           string     `json:"language"`
	CreatedBy          string     `json:"created_by"`
}

// struct pata tomar todos los valores de multi
type InfoStructMulti struct {
	Module         string   `json:"module"`
	QType          string   `json:"q_type"`
	Question       string   `json:"question"`
	N_Options      int      `json:"n_options"`
	Options        []string `json:"options"`
	Correct_option []string `json:"correct_option"`
	Explanation    string   `json:"explanation"`
	CreatedBy      string   `json:"created_by"`
}

// struct para generar string de info de la info global
type InfoStructCodepWithoutKeys struct {
	Description        string     `json:"description"`
	Hinputs            [][]string `json:"hinputs"`
	Houtputs           []string   `json:"houtputs"`
	Sinputs            [][]string `json:"sinputs"`
	Soutputs           []string   `json:"soutputs"`
	TimeoutSec         int        `json:"timeoutSec"`
	ForbiddenFunctions []string   `json:"forbiddenFunctions"`
	InitialCode        string     `json:"initialCode"`
	Language           string     `json:"language"`
}

// struct para generar string de info de la info global
type InfoStructMultiWithoutKeys struct {
	Question       string   `json:"question"`
	N_Options      int      `json:"n_options"`
	Options        []string `json:"options"`
	Correct_option []string `json:"correct_option"`
	Explanation    string   `json:"explanation"`
}

type SubmitAttemptReq struct {
	QuestionID  string   `json:"question"`
	AssigmentID string   `json:"assignment"`
	AttemptTime int64    `json:"attempt_time"`
	StudentID   string   `json:"student"`
	GroupID     string   `json:"group"`
	Answers     []string `json:"answers"`
	Code        string   `json:"code"`
}

type MultiChoiceResult struct {
	Passed      bool   `json:"passed"`
	Explanation string `json:"explanation"`
}

type CodeExecReq struct {
	Code       string `json:"code"`
	QuestionID string `json:"id"`
}

type CodeExecResponse struct {
	Error        string                   `json:"error"`
	ShownTests   []map[string]interface{} `json:"shownTests"`
	ShownPassed  int                      `json:"shownPassed"`
	ShownFailed  int                      `json:"shownFailed"`
	HiddenTests  map[string]int           `json:"hiddenTests"`
	Passed       bool                     `json:"passed"`
}
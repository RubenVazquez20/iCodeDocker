package structs

type Course struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	NModules int    `json:"n_modules"`
}

type NewCourseReq struct {
	ID      string   `json:"id"`
	Name    string   `json:"name"`
	Modules []string `json:"modules"`
}

type UpdateCourneNameReq struct {
	ID      string `json:"id"`
	NewName string `json:"new_name"`
}

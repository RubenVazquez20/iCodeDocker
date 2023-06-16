package util

import (
	"elPadrino/RIDDLE/packages/structs"
	"net/http"
	"regexp"
	"strings"
)

// Funcion para definir el tipo de pregunta
func QType(w http.ResponseWriter, question structs.RequestQuestion) (string, error) {
	// Verificar si el string contiene "multi" como palabra independiente
	if matched, _ := regexp.MatchString(`\bmulti\b`, strings.ToLower(question.Info)); matched {
		return "multi", nil
	}
	// Verificar si el string contiene "codep" como palabra independiente
	if matched, _ := regexp.MatchString(`\bcodep\b`, strings.ToLower(question.Info)); matched {
		return "codep", nil
	}
	// Si no contiene ninguna de las palabras clave
	return "Tipo de pregunta no válido", nil
}

package util

import "strings"

func EscapeForJSON(input string) string {
	// Aquí puedes implementar la lógica para escapar los caracteres especiales en la cadena JSON
	// Por ejemplo, puedes usar la función strings.ReplaceAll para reemplazar los caracteres especiales

	escaped := strings.ReplaceAll(input, "/", "\\/")
	escaped = strings.ReplaceAll(escaped, "\b", "\\b")
	escaped = strings.ReplaceAll(escaped, "\f", "\\f")
	escaped = strings.ReplaceAll(escaped, "\n", "\\n")
	escaped = strings.ReplaceAll(escaped, "\r", "\\r")
	escaped = strings.ReplaceAll(escaped, "\t", "\\t")

	return escaped
}

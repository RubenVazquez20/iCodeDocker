package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
)

// Obtener informacion y comprobacion de estructura de Info para CODEP
func GetInfoMulti(w http.ResponseWriter, input string, stmt *sql.Stmt) error {
	//Call the GetInfoStructCodep function to get the structure with the data.
	err := GetInfoStructMulti(w, input, stmt)
	if err != nil {
		return err
	}

	return err
}

// Function to storage the values from initial JSON in a structure
func GetInfoStructMulti(w http.ResponseWriter, input string, stmt *sql.Stmt) error {

	// Deserializar JSON en un mapa
	var data map[string]interface{}
	err := json.Unmarshal([]byte(input), &data)
	if err != nil {
		return fmt.Errorf("error al deserializar el JSON: %v", err)
	}

	/* clean := input
	clener := EscapeForJSON(clean) */

	// Verificar si todas las llaves están presentes en el mapa
	keys := make(map[string]bool)
	keys["module"] = true
	keys["q_type"] = true
	keys["question"] = true
	keys["n_options"] = true
	keys["options"] = true
	keys["correct_option"] = true
	keys["explanation"] = true
	keys["created_by"] = true

	for key := range keys {
		if _, ok := data[key]; !ok {
			return fmt.Errorf("la llave '%s' no está presente en el JSON", key)
		}
	}

	// Verificar que todas las llaves tengan un valor asignado
	var info structs.InfoStructMulti
	err = json.Unmarshal([]byte(input), &info)
	if err != nil {
		return fmt.Errorf("error al analizar el JSON: %v", err)
	}

	value := reflect.ValueOf(info)
	typeInfo := reflect.TypeOf(info)

	for i := 0; i < value.NumField(); i++ {
		field := value.Field(i)
		fieldName := typeInfo.Field(i).Name

		// Verificar que todas las llaves tengan un valor asignado, excepto forbiddenFunctions e initialCode
		if fieldName != "InitialCode" {
			switch field.Kind() {
			case reflect.String:
				if field.String() == "" || !field.IsValid() {
					return fmt.Errorf("la llave '%s' no tiene un valor asignado", fieldName)
				}
			case reflect.Slice:
				if field.Len() == 0 {
					return fmt.Errorf("la llave '%s' no tiene un valor asignado", fieldName)
				}
			case reflect.Int:
				if field.Int() == 0 {
					return fmt.Errorf("la llave '%s' no tiene un valor asignado", fieldName)
				}
			}
		}
	}

	// Validar la cantidad de opciones
	if len(info.Options) != info.N_Options {
		return fmt.Errorf("la cantidad de opciones no coincide con 'n_options'")
	}

	//Comprobar que correct_option se encuentre en options
	if !isCorrectOptionValid(info.Correct_option, info.Options) {
		return fmt.Errorf("'correct_option' no se encuentra en 'options'")
	}

	//Create info string from all remaining initial info elements
	stringInfo, err := GetWithoutKeysMulti(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	//Insert data in DB
	err = InsertQueryMulti(w, stringInfo, info, stmt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	return nil
}

// Recibe el string de .info completo toma solo lo necesario y devuelve el string a insertar en la DB
func GetWithoutKeysMulti(input string) (string, error) {
	var info structs.InfoStructMultiWithoutKeys
	err := json.Unmarshal([]byte(input), &info)
	if err != nil {
		return "", fmt.Errorf("error al analizar el JSON: %v", err)
	}
	newInfo, err := json.Marshal(info)
	if err != nil {
		return "", fmt.Errorf("error al analizar el JSON: %v", err)
	}
	newInfoString := string(newInfo)
	return newInfoString, nil
}

// Check the existense of correct_option in options
func isCorrectOptionValid(correctOption []string, options []string) bool {
	for i, option := range options {
		if option == correctOption[i] {
			return true
		}
	}
	return false
}

// Casos de prueba y seguridad para multi

// (Completed) Revisar que vengan todas las llaves
// (Completado) Revisar que todas las llaves tengan valores
// Que no puedan inyectar condigo malcioso en los espacios
// (completed) Comprobar que n_options coincida con la cantidad de elementos en el arreglo de options
// (completed) revisar que correct_option exista en options

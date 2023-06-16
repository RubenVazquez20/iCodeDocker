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
func GetInfoCodep(w http.ResponseWriter, input string, stmt *sql.Stmt) error {
	// Recibo el string de Info
	//input = "{\"module\": \"M0000000000000000001\", \"q_type\": \"codep\", hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a sefunction that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"], \"created_by\": \"L00000002\"}"
	//Call the GetInfoStructCodep function to get the structure with the data.
	err := GetInfoStructCodep(w, input, stmt)
	if err != nil {
		return err
	}

	return err
}

// Function to storage the values from initial json in a structure
// Function to storage the values from initial JSON in a structure
func GetInfoStructCodep(w http.ResponseWriter, input string, stmt *sql.Stmt) error {
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
	keys["description"] = true
	keys["hinputs"] = true
	keys["houtputs"] = true
	keys["sinputs"] = true
	keys["soutputs"] = true
	keys["timeoutSec"] = true
	keys["forbiddenFunctions"] = true
	keys["initialCode"] = true
	keys["language"] = true
	keys["created_by"] = true

	for key := range keys {
		if _, ok := data[key]; !ok {
			return fmt.Errorf("la llave '%s' no está presente en el JSON", key)
		}
	}

	// Verificar que todas las llaves tengan un valor asignado
	var info structs.InfoStructCodep
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
		if fieldName != "InitialCode" && fieldName != "ForbiddenFunctions" {
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

	//Create info string from all remaining initial info elements
	stringInfo, err := GetWithoutKeysCodep(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}
	//Insert data in DB
	err = InsertQueryCodep(w, stringInfo, info, stmt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return err
	}

	return nil
}

// Recibe el string de .info completo toma solo lo necesario y devuelve el string a insertar en la DB
func GetWithoutKeysCodep(input string) (string, error) {
	var info structs.InfoStructCodepWithoutKeys
	err := json.Unmarshal([]byte(input), &info)
	if err != nil {
		fmt.Println("Error al analizar el JSON:", err)
	}
	newInfo, err := json.Marshal(info)
	if err != nil {
		fmt.Println("Error al analizar el JSON:", err)
	}
	newInfoString := string(newInfo)
	return newInfoString, err
}

// Casos de prueba y seguridad para codep

// (Completado) Revisar que vengan todas las llaves (puedo acceder a las llaves de la estructura y usar COntain para definir si el string de info global cuenta con todas las llaves)
// (Completado) Revisar que todas las llaves tengan valores, a excepcion de initialCode y forbiddenFunctions pues puede que no tengan valores
// () Que no puedan inyectar codigo malcioso en los espacios (en el strig de info global revisr que no exista codigo malicioso)

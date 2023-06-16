<h1 style="color:#93e5ab; font-size: 40px">RIDDLE API</h1>

RIDDLE (Question Resource Interface for Developing, Deploying, and Logging Exams) es una API con el
propósito de mostrar preguntas cuando el estudiante las solicite, siguiendo el siguiente orden:
1. Primero le dará las preguntas que no se hayan completado como correctas.
2. Después le dará las preguntas que haya contestado de manera incorrecta para que intente resolverlas nuevamente.

Nunca se le darán preguntas repetidas, en caso de no existir más preguntas se le notificará al usuario.
Funcionando como un conector entre las BBDDs (MongoDB y MySQL) y el cliente.

<h2 style="color:#65b891;">URL BASE</h2>
34.16.137.250:8003

<h1 style="color:#B5FFE1;">ENDPOINTS de Lectura</h1>
________________________________________________________________
<h2 style="color:#65b891;">ENDPOINT de solicitud de preguntas de Modulo o Tarea</h2>

<h3 style="color:#0000FF;">/questions</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Solicitar una pregunta nueva, puede ser de una tarea  de un modulo

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
GET

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| id_student   | string    | si                                           | ID del estudiante que pide preguntas                   |
| id_assigment | string    | si                                           | ID del modulo o Tarea desde la que se hace la peticion | 
| id_group     | string    | solo en caso de pregunta de modulo           | ID del grupo al que pertene el estudiante              |

<h3 style="color:#b5ffe1;">Respuesta para ambos casos</h3>
(En formato JSON)
| Campo          | Tipo                  | Descripcion                                                         |
| -------------- | --------------------- | ------------------------------------------------------------------: |
| id_pregunta    | string                | ID de la pregunta obtenida                                          |
| type           | string                | Tipo de la pregunta (codep o multi)                                 |
| info           | string                | Informacion de la pregunta (descripcion, inputs y outputs, etc)     |

<h3 style="color:#b5ffe1;">Ejemplos</h3>
<p style= "font-weight: bold;">Peticion Para Pregunta de Tarea</p>

GET 
34.16.137.250:8003/questions?id_assigment=H0000000000000000001&id_student=A01551955

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK Content-Type: application/json
``` json
{
    "id_pregunta": "CQ000000000000000005",
    "type": "codep",
    "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}"
}
```

<p style= "font-weight: bold;">Peticion Para Pregunta de Modulo</p>

GET 
34.16.137.250:8003/questions?id_assigment=H0000000000000000001&id_student=A01551955&id_group=G000000001

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK Content-Type: application/json
``` json
{
    "id_pregunta": "CQ000000000000000004",
    "type": "codep",
    "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}"
}
```

_______________________________________________
### `/studentprogress`
#### Descripcion
Progreso de un estudiante de un modulo o tarea

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante variables de url)
* `student` (obligatorio): ID estudiante del que se desea consultar el progreso
* `assignment` (obligatorio): ID del modulo o tarea del que se desea consultar el progreso
* `group` (obligatorio para progreso de modulo): ID del grupo del modulo del que se desea ver el progreso 

#### Respuestas
(En formato JSON) 
| Campo            | Tipo                  | Descripcion                    |
| ---------------- | --------------------- | ------------------------------ |
| needed           | int                   | Numero de preguntas necesarias para terminar el modulo/tarea |
| answered         | int                   | Numero de preguntas que se han contestado de ese modulo/tarea|

#### Ejemplo
**Peticion**
GET 34.16.137.250:8003/studentprogress?student=A01551955&assignment=M0000000000000000001&group=G000000001

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
{
    "needed": 3,
    "answered": 1
}
```

_______________________________________________

<h3 style="color:#0000FF;">/freemodequestion/{moduleID}</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Regresa una pregunta aleatoria del modulo dado, independientemente de si el estudiante ya la ha contestado anteriormente

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
GET

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante variables de ruta)

| Parametro  | Tipo      | Obligatorio    | Decripcion                                             |
| :---------:| :-------: | :------------: | :----------------------------------------------------: |
| moduleID   | string    | si             | ID del modulo del que se requiere la pregunta          |


<h3 style="color:#b5ffe1;">Ejemplo</h3>

<p style= "font-weight: bold;">Peticion</p>
GET 
34.16.137.250:8003/freemodequestion/M0000000000000000001


<h3 style="color:#b5ffe1;">Respuesta</h3>
(En formato JSON) 
| Campo          | Tipo                  | Descripcion                                                         |
| -------------- | --------------------- | ------------------------------------------------------------------: |
| id_pregunta    | string                | ID de la pregunta obtenida                                          |
| type           | string                | Tipo de la pregunta (codep o multi)                                 |
| info           | string                | Informacion de la pregunta (descripcion, inputs y outputs, etc)     |

HTTP/1.1 200 OK Content-Type: application/json
``` json
{
    "id_pregunta": "CQ000000000000000001",
    "type": "codep",
    "info": "{\"hinputs\": [[\"2\"], [\"4\"]], \"sinputs\": [[\"3\"], [\"6\"]], \"houtputs\": [\"4\", \"16\"], \"language\": \"python\", \"soutputs\": [\"9\", \"36\"], \"timeoutSec\": 10, \"description\": \"Double a number\", \"initialCode\": \"\", \"forbiddenFunctions\": []}"
}
```


<h1 style="color:#B5FFE1;">ENDPOINTS de Escritura</h1>
_____________________________________________________
<h2 style="color:#65b891;">ENDPOINT de solicitud de carga de Preguntas a Administrador desde interfaz</h2>

<h3 style="color:#0000FF;">/requestQuestion</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Solicitud de carga de preguntas por profesor a la plataforma

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
POST

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el Body)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                              |
| :---------:  | :-------: | :------------------------------------------: | :-----------------------------------------------------: |
| info         | string    | si                                           | Informacion general de la pregunta, desde el modulo, q_type, created_by y la descripcion que implica cada tipo de pregunta             |

<h3 style="color:#b5ffe1;">Respuesta</h3>
En caso de que se haya creado la tarea de forma exitosa, se regresa unicamente un codigo HTTP 200 (Ok) Nota: Se agrega la pregunta a la tabla de questions, con un current_status de "PEN" para que el administrador pueda aceptar o rechazarla

<h3 style="color:#b5ffe1;">Ejemplo</h3>
<p style= "font-weight: bold;">Peticion</p>


POST
Peticion POST 34.16.137.250:8003/requestQuestion Content-Type: application/json 

Siempre se pide un arreglo de objetos de tipo JSON, en el caso de la interfaz en la que el profesor solo carga una pregunta a la vez, se espera a traves del body un arreglo con un solo objeto en su interior, como el que se muestra a continuacion:

```json
[
    {
        "info": "{\"module\": \"M0000000000000000001\", \r\n \"q_type\": \"multi\", \"question\": \"how do you show send text to the screen\", \"n_options\": 3, \"options\": [\"print\",\"show\",\"wuajaja\"], \"correct_option\": [\"print\",\"show\"], \"explanation\": \"print is a coloquial term in programming...\", \"created_by\": \"L00000002\"}"
    }
]
```

Cuando se cargan preguntas a traves de un archivo, desde el frontend se recibe un arreglo de multiples objetos de tipo json, como el ejemplo a continuacion:

```json
[
    {
        "info": "{\"module\": \"M0000000000000000001\", \"q_type\": \"codep\", \"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"PRIMERAgest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"], \"created_by\": \"L00000002\"}"
    },
    {
        "info": "{\"module\": \"M0000000000000000001\", \r\n \"q_type\": \"multi\", \"question\": \"how do you show send text to the screen\", \"n_options\": 3, \"options\": [\"print\",\"show\",\"wuajaja\"], \"correct_option\": [\"print\",\"show\"], \"explanation\": \"print is a coloquial term in programming...\", \"created_by\": \"L00000002\"}"
    }
]
```

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 Ok

Esto indica que la pregunta ha sio cargada a la base de datos dentro de la tabla de questions con un status de PEN para su aprovacion o rechazo por el administrador.
_____________________________________________________
### `/submitAttempt/{questionType}`
#### Descripcion
Evalua la respuesta dada para un problema y registra el intento del estudiante (en caso de no ser modo libre)

#### Metodo de HTTP
`POST`

#### Parametros
(Mediante variables de url)
* `questionType` (obligatorio): Tipo de pregunta a evaluar. 'code' para programacion, 'mutipleChoice' para opcion multiple

(Mediante body request)
| Campo                                                             | Tipo                  | Descripcion                   |
| ----------------------------------------------------------------- | --------------------- | ----------------------------- |
| attempt_time (obligatorio, con excepcion de modo libre)           | int                   | Segundos que le tomo al estudiante resolver el problema |
| assignment (obligatorio)                                          | string                | ID del modulo o tarea         |
| group (obligatorio para modulo, con excepcion de modo libre)      | string                | ID del grupo                  |
| question (obligatorio)                                            | string                | ID de la pregunta contestada  |
| student (obligatorio, con excepcion de modo libre)                | string                | Matricula del estudiante      |
| code (obligatorio si tipo de pregunta es de programacion)         | string                | Codigo hecho por el estudiante|
| answers (obligatorio si tipo de pregunta es de opcion multiple)   | [ string ]            | Respuestas seleccioandas      |

#### Respuestas
* Para preguntas de opcion multiple
(En formato JSON)
| Campo                 | Tipo                  | Descripcion               |
| --------------------- | --------------------- | ------------------------- |
| passed                | bool                  | Indicador de si pasó o no |
| explanation           | string                | Explicación de la pregunta (si esta contiene alguna)|

* Para preguntas de programacion
(En formato JSON)
| Campo          | Tipo                       | Descripcion                                                                                 |
| -------------- | ---------------------      | -----------------------------------------------------------------                           |
| error          | string                     | Error generado al ejecutar el código, en caso de que no hayan errores es un string vacio    |
| shownTests     | [ map[ string ]string/bool ] | Casos de prueba visibles                                                                    |
| shownPassed    | int                        | Numero de casos de pruebas visibles que pasaron                                             |
| shownFailed    | int                        | Numero de casos de pruebas visibles que fallaron                                            |
| hiddenTests    | map[ string ]int             | Cantidad de casos de prueba no visibles que pasaron y fallaron                              |
| passed         | bool                       | Un booleano que indica si todas las pruebas (tanto las mostradas como las ocultas) pasaron. |


#### Ejemplos
##### Opcion multiple
**Peticion**
POST 34.16.137.250:8003/submitAttempt/multipleChoice

```json
{
    "question": "CQ000000000000000002",
    "assignment": "M0000000000000000001",
    "student": "A01551955",
    "attempt_time": 12,
    "group": "G000000001",
    "answers": ["3"]
}
```

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
{
    "passed": true,
    "explanation": "The add() function takes two parameters and returns their sum. Calling add(3, 4) will return 7."
}
```

##### Programacion
**Peticion**
POST 34.16.137.250:8003/submitAttempt/code

```json
{
    "question": "CQ000000000000000001",
    "assignment": "M0000000000000000001",
    "student": "A01551955",
    "group": "G000000001",
    "attempt_time": 12,
    "code": "n = int(input())\nprint(n * n)"
}
```

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
{
    "error": "",
    "shownTests": [
        {
            "expected": "9",
            "got": "9",
            "input": "3",
            "passed": true
        },
        {
            "expected": "36",
            "got": "36",
            "input": "6",
            "passed": true
        }
    ],
    "shownPassed": 2,
    "shownFailed": 0,
    "hiddenTests": {
        "failed": 0,
        "passed": 2
    },
    "passed": true
}
```


<h1 style="color:#B5FFE1;">ENDPOINTS de Actualización</h1>
________________________________________________________________

<h2 style="color:#65b891;">ENDPOINT aceptación de pregunta del profesor por admin</h2>

<h3 style="color:#0000FF;">/aproveQuestionRequest/{questionID}</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Cuando el Administrador considera que una pregunta de propuesta para ser cargada a la base de datos si debe
ser admitida

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
PATCH

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| questionID   | string    | si                                           | ID de la pregunta que debe ser eliminada de la base de datos                 |


<h3 style="color:#b5ffe1;">Respuesta</h3>
Response 
HTTP/1.1 200 OK 

<h3 style="color:#b5ffe1;">Ejemplo</h3>

DELETE 
34.16.137.250:8003/aproveQuestionRequest/CQ000000000000000004

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK 

_______________________________________________

<h2 style="color:#65b891;">ENDPOINT rechazo de pregunta del profesor por admin</h2>

<h3 style="color:#0000FF;">/declineQuestionRequest/{questionID}</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Cuando el Administrador considera que una pregunta de propuesta para ser cargada a la base de datos no debe
ser admitida

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
PATCH

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| questionID   | string    | si                                           | ID de la pregunta que debe ser eliminada de la base de datos                 |


<h3 style="color:#b5ffe1;">Respuesta</h3>
Response 
HTTP/1.1 200 OK 

<h3 style="color:#b5ffe1;">Ejemplo</h3>

UPDATE
34.16.137.250:8003/declineQuestionRequest/CQ000000000000000005

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK 
// --------------------------------------------------------------------
// ** file="CreateQuestion.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { Button, FormControl, Grid, InputLabel, Modal, MenuItem, OutlinedInput, Select, Typography, useMediaQuery, useTheme, Alert } from '@mui/material'
import { UploadFile } from '@mui/icons-material'

// MindScript Components
import { useForm } from '../../hooks/useForm';
import { AddTestCases } from './';
import { AddMultiQ } from './';

// ------------ ## End Imports region ------------


export const CreateQuestion = ({ open, close, schoolID }) => {

    // Initial States and Variables 
    const batmanAPI = `http://localhost:8002/`
    const riddleAPI = `http://localhost:8003/`

    const theme = useTheme();
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const containerWidth = isXLargeScreen ? '80vw' : isLargeScreen ? '90vw' : isMediumScreen ? '80vw' : '95vw';


    //Description and explanation text inputs
    const { qdescription, qexplanation, onInputChange } = useForm({
        qdescription: '',
        qexplanation: '',
    });

    //Moudle selector
    const [qmodule, setQModule] = useState('');
    const handleQModuleSelection = (event) => {
        setQModule(event.target.value);
        // console.log(qmodule)
    };

    //Question type selector
    const [qtype, setQType] = useState('');
    const handleQTypeSelection = (event) => {
        setQType(event.target.value);
        console.log(qtype)
    };

    //Course selector
    const [course, setCourse] = useState('');
    const handleCourseSelection = (event) => {
        setCourse(event.target.value);
    };

    const questionTypes = ["codep", "multi"]

    // ------------ # API region ------------

    //GET - course information
    const [coursesData, setCourseRequest] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`${batmanAPI}courses`, options);
                const responseData = await response.json();
                setCourseRequest(responseData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);



    //GET - modules information
    const [modulesData, setModule] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            if (course) {
                try {
                    const response = await fetch(`${batmanAPI}coursemodules/${course}`, options);
                    const responseData = await response.json();
                    setModule(responseData);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [course]);

    let modules = [];
    modulesData.map((module) => (
        modules.push({
            id: module.id,
            name: module.name,
            n_questions: 0,
            checked: true,
            key: module.id
        })
    ))



    /*File upload section */
    const [formatedInfo, setJSONFormat] = useState("");
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            // console.log(fileContent); // Do something with the file content
            // console.log(`{"${JSON.stringify(fileContent).slice(1, -1)}"}`)
            setJSONFormat(fileContent);
            setFileUploaded(true);
            // console.log("FORMAT", formated)
        };
        // console.log(file)

        reader.readAsText(file);

    };


    //POST - question request 



    const requestAQuestion = async () => {
        console.log(qtype)
        var info = {}

        if (qtype === "multi") {
            const multiq = [];
            const multiqC = [];

            cMultiQ.map((tc) => {
                multiq.push(tc.opcion)
                multiqC.push(tc.opcion)
            })

            multiQ.map((tc) => {
                multiq.push(tc.opcion)
            })

            info = {
                "module": qmodule,
                "q_type": qtype,
                "question": qdescription,
                "n_options": multiq.length,
                "options": multiq,
                "correct_option": multiqC,
                "explanation": qexplanation,
                "created_by": schoolID,
            }

        } else {
            const hinputs = [];
            const houtputs = [];
            const sinputs = [];
            const soutputs = [];

            testCasesS.map((tc) => {
                sinputs.push(tc.input);
                soutputs.push(tc.output);
            })
            testCasesH.map((tc) => {
                hinputs.push(tc.input);
                houtputs.push(tc.output);
            })

            sinputs.map((I, index) => {
                const tmp = I.split("\n");
                sinputs[index] = tmp;
            })
            hinputs.map((I, index) => {
                const tmp = I.split("\n");
                hinputs[index] = tmp;
            })

            info = {
                "module": qmodule,
                "q_type": qtype,
                "hinputs": hinputs,
                "sinputs": sinputs,
                "houtputs": houtputs,
                "language": "python",
                "soutputs": soutputs,
                "timeoutSec": 10,
                "description": qdescription,
                "initialCode": "",
                "forbiddenFunctions": ["sum"],
                "created_by": schoolID,
            }


        }
        let request = "";


        if ((formatedInfo != "") && (qdescription == "" || qmodule == "" || qtype == "" || course == "")) {
            let fileInfo = JSON.stringify(
                formatedInfo
            )
            fileInfo = fileInfo.replace(/\\"info\\": {/g, '"info": "{')
            fileInfo = fileInfo.replace(/}\\r\\n /g, '}"')
            fileInfo = fileInfo.replace(/\\r\\n/g, '')
            fileInfo = fileInfo.substring(1, fileInfo.length - 1)
            console.log("fileInfo", fileInfo)
            request = fileInfo
        } else {
            request = JSON.stringify([{ "info": JSON.stringify(info) }])
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            mode: 'no-cors',
            body: request
        }
        console.log("options", options)
        fetch(`${riddleAPI}requestQuestion`, options)
            .then(response => {
                console.log(response.status)
                if (response.status === 200) {
                    close();
                }
            })
            .catch(error => {
                console.log(error)
            })
    };


    /* Datos necesarios para la interfaz de los test cases */
    const [multiQ, setMultiQ] = useState([]);
    const [cMultiQ, setCMultiQ] = useState([]);
    const [testCasesS, setTestCaseS] = useState([]);
    const [testCasesH, setTestCaseH] = useState([]);

    useEffect(() => {
        if (open) {
            setTestCaseS([]);
            setTestCaseH([]);
            setCourse('');
            setMultiQ([]);
            setCMultiQ([]);
            setQType('');
            setQModule('');
            setJSONFormat('');
            setFileUploaded(false);
        }
    }, [open]);

    /* Fin de test cases */

    const handleDeleteFiles = () => {
        setTestCaseS([]);
        setTestCaseH([]);
        setCourse('');
        setMultiQ([]);
        setCMultiQ([]);
        setQType('');
        setQModule('');
        setJSONFormat('');
        setFileUploaded(false);
    }

    return (
        <Modal
            id="Modal prrona Crear Pregunta"
            open={open}
            onClose={close}
            aria-labelledby="Nueva Pregunta"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                id="Grid container Crear Pregunta"
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: containerWidth,
                    height: '80vh',
                    overflowY: 'scroll',
                    "&::-webkit-scrollbar": {
                        width: 5,
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "secondary.main",
                        borderRadius: 2,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "appDark.scrollBar",
                        borderRadius: 2,
                    },
                }}>

                <Grid item xs={12} id="PrimeraSección">
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Creación de Pregunta
                    </Typography>
                </Grid>

                {/* Primera Seccion */}
                <Grid item xs={12} lg={6} md={6} sx={{ mt: 2 }}>

                    <Grid container justifyContent="center" sx={{
                        py: 2,
                        overflowY: 'scroll',
                        height: '60vh',
                        "&::-webkit-scrollbar": {
                            width: 5,
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "secondary.main",
                            borderRadius: 2,
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "appDark.scrollBar",
                            borderRadius: 2,
                        },
                    }}>

                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ mt: 3, width: '100%' }}>
                                <InputLabel id="courseSelectorInputLabel"
                                    sx={{
                                        color: 'appDark.text',
                                        '&:hover': {
                                            color: 'appDark.text' //change label color
                                        },
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}
                                >Curso</InputLabel>

                                <Select
                                    id="courseSelector"
                                    value={course}
                                    onChange={handleCourseSelection}
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: 'appDark.bgBox',
                                            },
                                        },
                                    }}
                                >
                                    {coursesData.map((course) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.id} {course.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>


                        {/* Module Selector */}
                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ mt: 3, width: '100%' }}>
                                <InputLabel id="courseSelectorInputLabel"
                                    sx={{
                                        color: 'appDark.text',
                                        '&:hover': {
                                            color: 'appDark.text' //change label color
                                        },
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}
                                >Módulo</InputLabel>

                                <Select
                                    id="moduleSelector"
                                    value={qmodule}
                                    onChange={handleQModuleSelection}
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: 'appDark.bgBox',
                                            },
                                        },
                                    }}
                                >
                                    {modulesData.map((module) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            key={module.id}
                                            value={module.id}
                                        // key={module}
                                        // value={module}
                                        >
                                            {module.id} {module.name}
                                            {/* {module} */}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Type Selector (code or multiple selection)*/}
                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ mt: 3, width: '100%' }}>
                                <InputLabel id="questionTypeSelectorInputLabel"
                                    sx={{
                                        color: 'appDark.text',
                                        '&:hover': {
                                            color: 'appDark.text' //change label color
                                        },
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}
                                >Tipo de pregunta</InputLabel>


                                <Select
                                    id="questionTypeSelector"
                                    value={qtype}
                                    onChange={handleQTypeSelection}
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: 'appDark.bgBox',
                                            },
                                        },
                                    }}
                                >
                                    {questionTypes.map((qtype) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            key={qtype}
                                            value={qtype}
                                        >
                                            {qtype}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Question description */}
                        <Grid item xs={10} sx={{ mt: 2 }}>
                            <Grid container>
                                <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', height: 100 }}>
                                    <InputLabel sx={{
                                        color: 'appDark.text',
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        },
                                        height: 100
                                    }}>Descripción de la pregunta</InputLabel>
                                    <OutlinedInput
                                        type="input"
                                        label="Descripción de la pregunta"
                                        placeholder="Descripción"
                                        multiline={true}
                                        sx={{
                                            color: 'appDark.text',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'appDark.box', //change border color on hover
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'appDark.box', //change border color when focused
                                            },
                                            '&.MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'transparent',
                                                },
                                            },
                                            height: 100
                                        }}
                                        name='qdescription'
                                        value={qdescription}
                                        onChange={onInputChange}

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        {qtype == 'codep' ?
                            // SelectorY - TestCases para codigo
                            <>
                                <Grid item xs={10}>
                                    <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 2 }}>
                                        Caso de Prueba Visible
                                    </Typography>
                                </Grid>

                                <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                    overflowY: 'scroll',
                                    height: '25vh',
                                    "&::-webkit-scrollbar": {
                                        width: 5,
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: "secondary.main",
                                        borderRadius: 2,
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "appDark.scrollBar",
                                        borderRadius: 2,
                                    },
                                }}>
                                    <AddTestCases open={open} changeTestCase={setTestCaseS} />
                                    {/* {console.log("prueba de casos S", testCasesS)} */}
                                </Grid>

                                <Grid item xs={10}>
                                    <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 2 }}>
                                        Caso de Prueba Oculto
                                    </Typography>
                                </Grid>

                                <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                    overflowY: 'scroll',
                                    height: '25vh',
                                    "&::-webkit-scrollbar": {
                                        width: 5,
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: "secondary.main",
                                        borderRadius: 2,
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "appDark.scrollBar",
                                        borderRadius: 2,
                                    },
                                }}>
                                    <AddTestCases open={open} changeTestCase={setTestCaseH} />
                                    {/* {console.log("prueba de casos H", testCasesH)} */}
                                </Grid>
                            </>

                            :
                            null
                        }
                        {qtype == "multi" ?
                            // SelectorY - TestCases para preguntas multpiles
                            <>
                                {/* Question explanation : after selecting an answer */}
                                <Grid item xs={10} sx={{ mt: 2 }}>
                                    <Grid container>
                                        <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', height: 100 }}>
                                            <InputLabel sx={{
                                                color: 'appDark.text',
                                                '&.Mui-focused': {
                                                    color: 'appDark.text' //change label color
                                                },
                                                height: 100
                                            }}>Explicación</InputLabel>
                                            <OutlinedInput
                                                type="input"
                                                label="Explicación"
                                                placeholder="Esta explicación se desplegará cuando una respuesta se haya enviado como retroalimentación."
                                                multiline={true}
                                                sx={{
                                                    color: 'appDark.text',
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'appDark.box', //change border color on hover
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'appDark.box', //change border color when focused
                                                    },
                                                    '&.MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'transparent',
                                                        },
                                                    },
                                                    height: 100
                                                }}
                                                name='qexplanation'
                                                value={qexplanation}
                                                onChange={onInputChange}

                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 2 }}>
                                        Opciones Incorrectas
                                    </Typography>

                                </Grid>

                                <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                    overflowY: 'scroll',
                                    height: '25vh',
                                    "&::-webkit-scrollbar": {
                                        width: 5,
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: "secondary.main",
                                        borderRadius: 2,
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "appDark.scrollBar",
                                        borderRadius: 2,
                                    },
                                }}>
                                    <AddMultiQ open={open} changeMultiQ={setMultiQ} />
                                    {/* {console.log("multi erroneas",wMultiQ)} */}
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 2 }}>
                                        Opciones Correctas
                                    </Typography>

                                </Grid>

                                <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                    overflowY: 'scroll',
                                    height: '25vh',
                                    "&::-webkit-scrollbar": {
                                        width: 5,
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: "secondary.main",
                                        borderRadius: 2,
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "appDark.scrollBar",
                                        borderRadius: 2,
                                    },
                                }}>
                                    <AddMultiQ open={open} changeMultiQ={setCMultiQ} />
                                    {/* {console.log("multi erroneas",wMultiQ)} */}
                                </Grid>


                            </>
                            :
                            null
                        }



                    </Grid>
                </Grid>

                {/* Segunda Seccion */}
                <Grid item xs={12} lg={6} md={6} sx={{ mt: 2 }} >
                    <Grid container alignItems="center" justifyContent="center"
                        sx={{
                            overflowY: 'scroll',
                            height: '60vh',
                            "&::-webkit-scrollbar": {
                                width: 5,
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "secondary.main",
                                borderRadius: 2,
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "appDark.scrollBar",
                                borderRadius: 2,
                            },
                        }}>

                        <Grid item xs={10} align='center' >

                            <Button xs={12}
                                variant="contained"
                                component="label"
                                sx={{
                                    width: "30vw",
                                    height: "30vh",
                                    backgroundColor: fileUploaded ? 'appDark.adminButton' : 'secondary.main',
                                    borderRadius: '10px',
                                    boxShadow: '5px 5px 5px 5px rgba(0.1, 0.1, 0.1, 0.1)',
                                    ':hover': {backgroundColor: fileUploaded ? 'appDark.adminButton' : 'secondary.main'}
                                }}
                            >
                                <Grid container justifyContent="center" alignItems="center" align='center'>
                                    <Grid item xs={12} justifyContent="center">
                                        <UploadFile sx={{ color: 'appDark.icon', fontSize: 100, fontWeight: 80, my: 2 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                            Subir Archivo
                                        </Typography>
                                    </Grid>
                                </Grid>


                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".json"
                                    hidden
                                    onChange={handleFileUpload}
                                // onChange={(event) => console.log(event.target.files)}
                                />
                            </Button>
                            {/* //ESTA ES UNA CONDICIONAL IMPORTANTE */}
                            {((formatedInfo != "") && (qdescription != "" || qmodule != "" || qtype != "" || course != ""))
                                ? <><Alert severity="info">Actualmente existe un archivo seleccionado, elimine el archivo para hacer un inserción manual</Alert>
                                    <Button onClick={handleDeleteFiles} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>Eliminar selección de archivo</Button></>
                                : null
                            }

                        </Grid>

                        {/* end container segunda seccion */}
                    </Grid>

                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent='space-around' align='center' sx={{ mb: 2 }}>
                        <Grid item xs={6} id="cancelar" >
                            <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs={6} id="crear tarea" >
                            <Button type="submit" onClick={requestAQuestion} variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                Enviar solicitud
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Modal>
    )
}
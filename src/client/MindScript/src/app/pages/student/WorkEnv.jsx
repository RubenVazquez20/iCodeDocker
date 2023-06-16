// --------------------------------------------------------------------
// ** file="WorkEnv.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import * as React from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography, useTheme, Box } from '@mui/material'
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import Editor from '@monaco-editor/react';

// MindScript Components
import ConfettiExplosion from 'react-confetti-explosion';
import { TestsTabs, Timer } from '../../components';


export const WorkEnv = () => {
    const [componentKey, setComponentKey] = useState(0);
    const handleNewQuestion = () => {
        // Increment the key value to force a rerender of the component
        setComponentKey(prevKey => prevKey + 1);
    };
    const riddleAPI = `http://localhost:8003/`
    const theme = useTheme();

    const location = useLocation();
    //esto puede venir de SHHomeworkCard, SMHomeworkCard, SModuleCard
    const questionParams = location.state?.questionParams;
    const assParams = location.state?.homeworkParams; //hw data (id, name, group, etc) //si es módulo trae id y group

    // console.log("assassement params", assParams)
    // const questionInfo = JSON.parse(questionParams.info);
    const questionInfo = questionParams.info ? JSON.parse(questionParams.info) : {};
    // console.log(questionInfo)

    const questionDescription = questionInfo.description //primera descripción
    let questionId = questionParams.id_pregunta;


    // Initial States and Variables 
    let assid = "";
    let assgroup = "";
    let asscourse = "";
    let asstype = "";

    //Estados para cambiar la descripción
    const [questionid, setQuestionId] = useState(`${questionId}`);
    const [questiondes, setQuestionDes] = useState(`${questionDescription}`); //para manejar las descripciones de las siguientes preguntas

    const [content, setContent] = useState('#Type your answer here');
    const [fetchResponse, setResponse] = useState([]);
    const [fetchAttemptResponse, setAttemptResponse] = useState([]);
    const [showComponent, setShowComponent] = useState(false); //tests component

    //Estados y funciones necesarias para el dialogo con retro
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    //Timer States
    const [timerValue, setTimerValue] = useState(0);
    const [resetTimer, setResetTimer] = useState(false);

    // Current user data
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;
    if (user !== null) {
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Matrícula ", schoolID)
    }

    //Feedback confetti
    const [isExploding, setIsExploding] = useState(false);

    //Esto es para tarea
    if (assParams.hw_id && assParams.group_id && assParams.course_id) {
        assid = assParams.hw_id;
        assgroup = assParams.group_id;
        asscourse = assParams.course_id;
        asstype = 'tarea';
    }
    //Esto es para modulo
    if (assParams.id && assParams.group) {
        assid = assParams.id;
        assgroup = assParams.group;
        asscourse = assParams.course;
        asstype = 'modulo';
    }

    //Esto es para modo libre
    if (assParams.fm_id) {
        assid = assParams.fm_id;
        asscourse = assParams.course;
        asstype = 'libre';
    }
    // console.log(asscourse)



    // -------------------- # API region --------------------------

    //GET - Obtaining student's homework progress
    const [progress, setProgress] = useState([]);
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
                const response = await fetch(`${riddleAPI}studentprogress?student=${schoolID}&assignment=${assid}&group=${assgroup}`, options);
                const responseData = await response.json();
                setProgress(responseData);
                // console.log(progress)
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, [progress]); //porque esta aqui?



    //GET - next question information ------------
    const onClickNextQuestion = async () => {
        console.log("Next Question loading")
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        fetch(bootyCall, options)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseData => {
                setResponse(responseData);
                console.log("requestNextQuestion", responseData)
            })
            .catch(error => {
                console.log(error);
            })
    }

    let bootyCall = "";
    let bodyOddy = {}
    if (asstype === "tarea" || asstype === "modulo") {

        bodyOddy = {

            "question": questionid,
            "assignment": assid,
            "student": schoolID,
            "attempt_time": timerValue,
            "group": assgroup,
            "code": content,

        }
        bootyCall = `${riddleAPI}questions?id_assigment=${assid}&id_student=${schoolID}&id_group=${assgroup}`

    }
    if (asstype === "libre") {
        bodyOddy = {

            "question": questionId,
            "code": content,

        }
        bootyCall = `${riddleAPI}freemodequestion/${assid}`

    }

    //POST - to codeExec get testcases and register attempt
    const submitAttemp = async () => {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            mode: 'no-cors',
            body: JSON.stringify(bodyOddy)
        }
        console.log("body", options.body)

        fetch(`${riddleAPI}submitAttempt/code`, options)
            .then(response => {
                console.log(response)
                // setResetTimer(true);
                return response.json()
            })
            .then(json => {
                setAttemptResponse(json) //fetchAttemptResponse for code (error, showntests, hiddentests,shownPassed,shownFailed, passed)
                console.log("fetchAttemptResponse", fetchAttemptResponse)
                setShowComponent(true)
            })
            .catch(error => {
                console.log(error)
            })

    };
    // console.log("fetchAttemptResponse", fetchAttemptResponse)


    const handleSubmission = async () => {
        await submitAttemp();
        // handleAttemptResponse();
        // console.log("respuesta", fetchAttemptResponse) //se bora

    }

    useEffect(() => {
        if (fetchAttemptResponse.passed) {
            console.log("fetchAttemptResponse handle", fetchAttemptResponse);
            setOpen(true);
            setIsExploding(true);
            onClickNextQuestion();
        }
    }, [fetchAttemptResponse]);

    // -------------------- ## End API region ------------------

    const printsec = () => {
        console.log("completed in", timerValue)
    }

    // console.log(progress.answered, progress.needed)
    const [isHandleOnClickCalled, setIsHandleOnClickCalled] = useState(false);
    const handleOnClick = () => {
        setAttemptResponse([]);
        setIsHandleOnClickCalled(true);
        setShowComponent(false);
        setResetTimer(true);
        setContent('#Type your answer here');
    }

    useEffect(() => {
        if (progress.answered !== undefined && progress.needed !== undefined && isHandleOnClickCalled) {
            if (progress.answered === progress.needed) {
                window.location.href = `/student/modules/${assgroup}/${asscourse}`;
            }
        }
    }, [isHandleOnClickCalled, progress]);

    useEffect(() => {
        setIsHandleOnClickCalled(false);
        setQuestionDes(questionDescription);
        setQuestionId(questionId);
    }, [fetchResponse, questionDescription, questionId])

    const formattedSInputs = {};
    const formattedSOutputs = {};

    if (questionInfo !== null && questionInfo !== undefined) {

        for (const [key, value] of Object.entries(questionInfo.sinputs)) {
            if (Array.isArray(value)) {
                const formattedValue = value.map(arr => arr[0]).join(',');
                formattedSInputs[key] = formattedValue;
            } else {
                formattedSInputs[key] = value;
            }
        }

        for (const [key, value] of Object.entries(questionInfo.soutputs)) {
            if (Array.isArray(value)) {
                const formattedValue = value.map(arr => arr[0]).join(',');
                formattedSOutputs[key] = formattedValue;
            } else {
                formattedSOutputs[key] = value;
            }
        }
    }

    const homeworkExamples = {
        sinputs: formattedSInputs,
        soutputs: formattedSOutputs
    }

    return (
        <Grid container padding={3} justifyContent='center' alignContent='center' spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main', color: 'appDark.text' }}>

            <Grid item xs={12}>
                <Button href={asstype == 'tarea' || asstype == 'modulo' ? `/student/modules/${assgroup}/${asscourse}` : `/student/home`} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 14 }}>
                    {'< Regresar'}
                </Button>
            </Grid>

            <Grid item xs={4} sx={{
                overflowY: 'scroll',
                height: '90vh',
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
                <Grid container px={2} justifyContent='start' sx={{ bgcolor: 'secondary.main', color: 'appDark.text' }}>
                    {/* Question Description*/}
                    <Grid item xs={12}>
                        <Grid container py={2} alignItems='center'>
                            <Grid item xs={12} md={10}>
                                <Typography variant='h5' sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 20 }}>
                                    Pregunta {progress.answered + 1}
                                </Typography>
                            </Grid>

                            <Grid item align='right' xs={12} md={2}>
                                <Timer setTimerValue={setTimerValue} resetTimer={resetTimer} setResetTimer={setResetTimer} />
                            </Grid>

                        </Grid>
                        <Grid item xs={12} >
                            <Typography textAlign='justify' sx={{ color: 'appDark.text', fontSize: 15 }}>
                                {questiondes && questiondes.length > 0 && (
                                    questiondes + "   " + questionid
                                )}
                            </Typography>
                        </Grid>
                        {/* Prueba */}

                        <Grid item xs={12}>
                            <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                Lenguaje
                            </Typography>
                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                {questionInfo.language}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                Funciones Prohibidas
                            </Typography>
                            {questionInfo.forbiddenFunctions.length > 0 ?
                                <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                    {questionInfo.forbiddenFunctions}
                                </Typography>
                                :
                                <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                    No hay funciones prohibidas
                                </Typography>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                Código Inicial
                            </Typography>
                            {questionInfo.initialCode.length > 0 ?
                                <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                    {questionInfo.initialCode}
                                </Typography>
                                :
                                <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                    No hay código inicial
                                </Typography>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                Casos Públicos
                            </Typography>
                        </Grid>

                        {Object.entries(homeworkExamples.sinputs).map(([key, value]) => (
                            <Grid item xs={12} key={key}>
                                <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                    {`Caso ${parseInt(key, 10) + 1}`}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Box
                                        sx={{
                                            bgcolor: 'appDark.bgHwBox',
                                            borderRadius: 3,
                                            padding: '3px 12px',
                                            marginLeft: 2,
                                            marginTop: 1,
                                        }}
                                    >
                                        <Typography sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            Input: {value}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            bgcolor: 'appDark.bgHwBox',
                                            borderRadius: 3,
                                            padding: '3px 12px',
                                            marginTop: 1,
                                            marginLeft: 2,
                                            alignSelf: 'flex-start',
                                        }}
                                    >
                                        <Typography sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            Output: {homeworkExamples.soutputs[key]}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                Tiempo Máximo de Ejecución
                            </Typography>
                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                {questionInfo.timeoutSec} seg
                            </Typography>
                        </Grid>

                        {/* Fin Prueba */}
                    </Grid>

                    <Grid container justifyContent='space-between' alignItems='flex-end'>
                        {fetchAttemptResponse.passed ?
                            fetchResponse != undefined && fetchResponse != null
                                // ? <Typography>{fetchResponse.info}</Typography>
                                ? < Link
                                    to={{
                                        pathname: fetchResponse.type === 'codep' ? "/student/workenv" : fetchResponse.type === 'multi' ? "/student/multiopt" : ""
                                    }}
                                    key={componentKey}
                                    state={{ questionParams: fetchResponse, homeworkParams: assParams }}
                                    style={{ textDecoration: 'none', color: theme.palette.appDark.textBlack }}
                                >
                                    <Grid item xs={6} align='center' sx={{ mb: 2 }}>
                                        <Button onClick={handleOnClick}
                                            variant="contained" sx={{ backgroundColor: 'appDark.adminButton' }}>
                                            Siguiente
                                        </Button>
                                    </Grid>

                                </Link>
                                : null
                            : null
                        }

                        <Grid item xs={fetchAttemptResponse.passed ? 6 : 12} align='right' sx={{ mb: 2 }}>

                            <Button onClick={() => { handleSubmission(); printsec(); }} disabled={fetchAttemptResponse.passed} sx={{ color: 'appDark.text', backgroundColor: 'appDark.button', ':hover': { backgroundColor: 'appDark.button', opacity: 0.7 } }}>
                                Entregar
                            </Button>

                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={8}>
                <Grid container px={1} justifyContent='end'>
                    {/* Code Editor */}
                    <Grid item xs={12}
                        sx={{ height: '50vh', bgcolor: 'secondary.main' }}>
                        <Editor
                            language='python'
                            theme="vs-dark"
                            value={content}
                            onChange={(value) => setContent(value)}
                        />
                    </Grid>
                    {/* Terminal*/}
                    <Grid item xs={12}
                        sx={{ height: '39vh', bgcolor: 'secondary.main', mt: '1vh', padding: '1.5vh' }}>
                        <Grid container alignItems='center' sx={{ height: '4vh' }}>
                            <Grid item xs={10}>
                                <Typography fontSize={20} sx={{ color: 'appDark.text' }}>Casos de Prueba</Typography>
                            </Grid>
                            <Grid item xs={2} align='right'>
                                <Typography sx={{ color: 'appDark.text' }}>Progreso: {progress.answered}/{progress.needed}</Typography>
                            </Grid>

                        </Grid>
                        {/* Displaying TestCases */}
                        {showComponent && (
                            <TestsTabs tests={fetchAttemptResponse} />
                        )}


                    </Grid>
                </Grid>
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { bgcolor: 'primary.main', color: 'appDark.text' }
                }}
            >

                <DialogTitle align='center'>
                    {isExploding &&
                        <ConfettiExplosion sx={{
                            align: "center",
                            force: 0.8,
                            duration: 3000,
                            particleCount: 80,
                            width: 1600,
                        }} />
                    }
                    {fetchAttemptResponse.passed ? "Respuesta Correcta" : "Respuesta Incorrecta"}
                </DialogTitle>
                <DialogActions>
                    {fetchAttemptResponse.passed ?

                        <Button autoFocus onClick={handleClose} sx={{ color: 'success.main' }}>
                            Cerrar
                        </Button>

                        :
                        <Button onClick={handleClose} autoFocus sx={{ color: 'error.main' }}>
                            Volver a Intentar
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
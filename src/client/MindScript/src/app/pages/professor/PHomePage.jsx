import { Grid, useTheme, Typography, CardContent, CardActionArea, InputLabel, MenuItem } from '@mui/material'
import { HomeLayout } from '../../layout/HomeLayout';
import { Link } from 'react-router-dom';
import { CoursesCard, ActionButton, CreateGroup, CreateHomework, CreateQuestion } from '../../components';
import { AddCircleOutline, NoteAddOutlined, QuizOutlined, ChecklistOutlined } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";

export const PHomePage = () => {
    const theme = useTheme();
    const batmanAPI = `http://localhost:8002/`

    const [selectedTerm, setSelectedTerm] = useState('');

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    var schoolID;
    if (user !== null) {
        // console.log("Professor home user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Nómina L00000000
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Nómina ", schoolID)
    }

    const pages = [
        { name: 'Home', route: '/professor/home' },
        { name: 'Profile', route: '/professor/profile' },
    ]

    //GET - Obtaining terms
    const [termsData, setTerm] = useState([]);
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
                const response = await fetch(`${batmanAPI}terms`, options);
                const responseData = await response.json();
                setTerm(responseData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [termsData]);

    //API para obtener la info de los grupos
    const [groupsData, setGroup] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            if (selectedTerm.length === 0) {
                try {
                    const response = await fetch(`${batmanAPI}groups?id=${schoolID}&term=current`, options);
                    const responseData = await response.json();
                    setGroup(responseData);
                } catch (error) {
                    console.error(error);
                }
            }
            if (selectedTerm) {
                try {
                    const response = await fetch(`${batmanAPI}groups?id=${schoolID}&term=${selectedTerm}`, options);
                    const responseData = await response.json();
                    setGroup(responseData);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchData();
    }, [selectedTerm, groupsData]);


    //Funciones para abrir la modal de Crear Curso
    const [open, setOpen] = useState(false);
    const showModal = () => { setOpen(true); }
    const closeModal = () => {
        setOpen(false);
    }

    //Funciones para abrir la modal de Crear Curso
    const [openCreateHomework, setOpenCreateHomework] = useState(false);
    const showModalCreateHomework = () => { setOpenCreateHomework(true); }
    const closeModalCreateHomework = () => {
        setOpenCreateHomework(false);
    }

    //Funciones para abrir la modal de Crear Curso
    const [openCreateQuestion, setOpenCreateQuestion] = useState(false);
    const showModalCreateQuestion = () => { setOpenCreateQuestion(true); }
    const closeModalCreateQuestion = () => {
        setOpenCreateQuestion(false);
    }


    //Dynamic modal view
    const home = '/professor/home'
    const modules = '/professor/modules' //El nombren se debe de sacar desde la pagina home

    //API para obtener los datos de las tareas de la semana
    const [homeworkData, setHomework] = useState([]);
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
                const response = await fetch(`${batmanAPI}homework?id=${schoolID}&time=future&group=all&group_by=group`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);

    const homework = Object.entries(homeworkData)

    const handleTermSelection = (event) => {
        const value = event.target.value;
        setSelectedTerm(value);
    };

    return (
        <Grid container justifyContent='center' alignItems='center'>

            <HomeLayout groupsData={groupsData} homeworkData={homework} hwBTitle={'Asignaciones en Curso'} home={home} pages={pages}>

                {/* Modales */}
                <CreateGroup open={open} close={closeModal} />
                <CreateHomework open={openCreateHomework} close={closeModalCreateHomework} />
                <CreateQuestion open={openCreateQuestion} close={closeModalCreateQuestion} schoolID={schoolID} />

                <Grid container columnSpacing={5} rowSpacing={5}>

                    <Grid item md={12} xs={12} >
                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 500 }} >Acciones</Typography>
                    </Grid>

                    <Grid item xs={12} lg={6} xl={4} align='center'>
                        <ActionButton >
                            <CardActionArea onClick={showModal} sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <AddCircleOutline sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Crear Grupo
                                    </Typography>


                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                    <Grid item xs={12} lg={6} xl={4} align='center'>

                        <ActionButton >
                            <CardActionArea onClick={showModalCreateHomework} sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <NoteAddOutlined sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Crear Tarea
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                    <Grid item xs={12} lg={6} xl={4} align='center'>
                        <ActionButton >
                            <CardActionArea onClick={showModalCreateQuestion} sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <QuizOutlined sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Crear Pregunta
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                    <Grid item xs={12} lg={6} xl={4} align='center'>
                        <ActionButton >
                            <Link to='/professor/request' style={{ textDecoration: 'none' }}>
                                <CardActionArea sx={{ height: 207, textAlign: "center" }}>
                                    <CardContent sx={{ pt: 4, pb: 6 }}>
                                        <ChecklistOutlined sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                            Ver Estatus de Pregunta
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                        </ActionButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container>

                            <Grid item xs={8}>
                                <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 500 }} >Grupos Existentes</Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel
                                        sx={{
                                            color: 'appDark.text',
                                            '&:hover': {
                                                color: 'appDark.text' //change label color
                                            },
                                            '&.Mui-focused': {
                                                color: 'appDark.text' //change label color
                                            }
                                        }}
                                    >Periodo</InputLabel>

                                    <Select
                                        value={selectedTerm}
                                        onChange={handleTermSelection}
                                        sx={{ borderRadius: "10px", bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    bgcolor: 'appDark.bgBox',
                                                },
                                            },
                                        }}
                                    >
                                        {termsData.map((term) => (
                                            <MenuItem
                                                sx={{
                                                    color: "appDark.text",
                                                    bgcolor: 'appDark.bgBox',
                                                    '&:hover': {
                                                        bgcolor: 'appDark.selectHover' //change label color
                                                    },
                                                }}
                                                key={term.name}
                                                value={term.id}
                                            >
                                                {term.name}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                    </Grid>

                    {groupsData.map((group, index) => (
                        <Grid key={index} item xs={12} lg={6} xl={4} align='center' sx={{ pb: 5, pl: 5 }}>
                            <CoursesCard group={group} index={index} modules={modules} />
                        </Grid>
                    ))}
                </Grid>

            </HomeLayout >
        </Grid>
    )
}
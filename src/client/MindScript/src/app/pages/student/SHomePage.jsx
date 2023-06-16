// --------------------------------------------------------------------
// ** file="SHomePage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { CardContent, CardActionArea, Grid, Typography, Card, InputLabel, MenuItem } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { getAuth } from "firebase/auth";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// MindScript Components
import { HomeLayout } from '../../layout/HomeLayout';
import { ActionButton, CoursesCard, CourseRegister } from '../../components';

// ------------ ## End Imports region ------------

export const SHomePage = () => {

    // Initial States and Variables 
    const batmanAPI = `http://localhost:8002/`
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]
    const [selectedTerm, setSelectedTerm] = useState('');

    //Navigate to
    //remove?
    const modules = "/student/modules"
    const home = "/student/home"

    //Modal Course Registration States
    const [count, setCount] = useState(0);
    const [openModalRegister, setOpenRegister] = useState(false);
    const showModalRegister = () => { setOpenRegister(true); }
    const closeModalRegister = () => {
        setOpenRegister(false);
        setCount(0);
    }

    //Current user data
    const auth = getAuth();
    const user = auth.currentUser;
    var schoolID;
    if (user !== null) {
        const { email, displayName, emailVerified, uid } = user
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Student modules user info", user)
        // console.log("Matrícula ", schoolID)
    }

    // ------------ # API region ------------

    //POST - remove?
    const handlerHelp = async () => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors',
                body: JSON.stringify({
                    id: "L01922384",
                    term: "current"
                })
            };

            const request = await fetch(`${batmanAPI}courses`, options);
            // if (!request.ok) {
            //   throw new Error(`HTTP error! status: ${request.status}`);
            // }
            // console.log(request);
            const incomingdata = await request.json();
            console.log(data);

        }
        catch (error) {
            console.log("aaaa", error)
        }
    }

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

    //GET - group information
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
            if(selectedTerm){
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

    //GET - Obtaining weekly homework data
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
                const response = await fetch(`${batmanAPI}homework?id=${schoolID}&time=week&group=all&group_by=week`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, [homeworkData]);

    // ------------ ## End API region -------

    // ------- # Functions and Events region -------
    const handleTermSelection = (event) => {
        const value = event.target.value;
        setSelectedTerm(value);
    };
    // ---- ## End Functions and Events region -----

    return (
        <HomeLayout homeworkData={homeworkData} student={true} hwBTitle={'Asignaciones Faltantes'} home={home} pages={pages} >
            {/* Modales */}
            <CourseRegister open={openModalRegister} close={closeModalRegister} setCount={setCount} count={count} />

            <Grid container columnSpacing={5} rowSpacing={5}>
                <Grid item xs={12} >
                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 500 }} >Acciones</Typography>
                </Grid>
                <Grid item xs={12} lg={6} xl={4} align='center'>
                    <ActionButton >
                        <CardActionArea onClick={showModalRegister} sx={{ height: 207, textAlign: "center" }}>
                            <CardContent sx={{ pt: 4, pb: 6 }}>
                                <AddCircleOutline sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                    Enrolar Curso
                                </Typography>
                            </CardContent>
                        </CardActionArea>
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

                <Grid item xs={12} lg={6} xl={4} align='center'>
                    <Card sx={{
                        width: 300,
                        height: 246.5,
                        backgroundColor: 'secondary.main',
                        borderRadius: '12px',
                        boxShadow: '5px 5px 0px 5px rgba(0, 0, 0, 0.1)',
                        ':hover': { backgroundColor: 'secondary.main', opacity: 0.8 }
                    }}
                    >
                        <CardActionArea href={"freemode"}>
                            <Grid sx={{ backgroundColor: "#C12C45", height: 40 }} />
                            <CardContent sx={{ pt: 4, pb: 6, height: 208 }}>
                                <Typography align='center' xs={6} sx={{ color: 'appDark.text', fontSize: 30, fontWeight: 405, mt: 5 }} >
                                    Modo de Práctica
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {/* Displaying Group cards */}
                {groupsData.map((group, index) => (
                    <Grid key={index} item xs={12} lg={6} xl={4} align='center'>
                        <CoursesCard group={group} index={index} modules={modules} />
                    </Grid>
                ))}

            </Grid>

        </HomeLayout>
    )
}
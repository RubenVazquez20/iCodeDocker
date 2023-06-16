import { useState, useEffect } from 'react';
import { Grid, Typography, useTheme, Button, useMediaQuery } from '@mui/material';
import { NavBar, SearchBar } from '../../components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useParams, Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Block, Pending, CheckCircle } from '@mui/icons-material';

export const PDashboard = () => {
    const theme = useTheme();
    let params = useParams();
    const batmanAPI = `http://localhost:8002/`
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerHeight = isLargeScreen ? 60 : isMediumScreen ? 60 : 100;

    const pages = [
        { name: 'Home', route: '/professor/home' },
        { name: 'Profile', route: '/professor/profile' },
    ]
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e'];

    const [gridStats, setGridStats] = useState([]);
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
                const response = await fetch(`${batmanAPI}grouphwstatus/${params.group}`, options);
                const responseData = await response.json();
                setGridStats(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const [moduleProgress, setModuleProgress] = useState([]);
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
                const response = await fetch(`${batmanAPI}groupmodulestatus/${params.group}`, options);
                const responseData = await response.json();
                setModuleProgress(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const [failureRate, setFailureRate] = useState([]);
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
                const response = await fetch(`${batmanAPI}groupmodulefailurerate/${params.group}`, options);
                const responseData = await response.json();
                setFailureRate(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const [nameQuery, setNameQuery] = useState("");
    const [idQuery, setIdQuery] = useState("");
    let homeworkNames, columns, rows, dataFiltered;
    // Extracting unique homework names
    if (Array.isArray(gridStats) && gridStats.length > 0) {
        homeworkNames = Array.from(new Set(gridStats[0].homework.map(homework => homework.name)));

        // Define columns based on homework names
        columns = [
            { field: 'matricula', headerName: 'Matricula', maxWidth: 100, flex: 2, align: 'center', headerAlign: 'center' },
            { field: 'nombre', headerName: 'Student', maxWidth: 200, flex: 2, align: 'center', headerAlign: 'center' },
            ...homeworkNames.map(homeworkName => ({
                field: homeworkName,
                headerName: homeworkName,
                width: 200,
                renderCell: (params) => {
                    const homeworkStatus = params.row[homeworkName];
                    return homeworkStatus === 'not started' ? <Block sx={{ color: 'appDark.rejected' }} /> : homeworkStatus === 'started' ? <Pending sx={{ color: 'appDark.pending' }} /> : homeworkStatus === 'passed' ? <CheckCircle sx={{ color: 'appDark.approved' }} /> : null;
                },
                flex: 2, align: 'center', headerAlign: 'center'
            })),
            {
                field: 'finishedCount',
                headerName: 'Reporte',
                maxWidth: 90,
                renderCell: (params) => {
                    const homeworkStatuses = Object.values(params.row).slice(3);
                    const finishedCount = homeworkStatuses.filter(status => status === 'passed').length;
                    const totalCount = homeworkStatuses.length;
                    return `${finishedCount}/${totalCount}`;
                },
                flex: 2, align: 'center', headerAlign: 'center'
            },
        ];

        // Define rows based on the data
        rows = gridStats.map((student) => ({
            id: student.matricula,
            matricula: student.matricula,
            nombre: student.nombre,
            ...student.homework.reduce((acc, homework) => {
                acc[homework.name] = homework.status;
                return acc;
            }, {}),
        }));

        dataFiltered = filterData(nameQuery, idQuery, rows);
    }

    return (
        <Grid container alignContent='center' justifyContent='center' align='center' padding={3} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />
            <Grid item xs={12} align='left' sx={{ mt: 4, height: '1vh' }}>
                <Button component={Link} to={`/professor/modules/${params.group}/${params.course}`} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 16 }}>
                    {'< Modulos'}
                </Button>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, height: '1vh' }}>
                <Typography sx={{ color: 'appDark.text', fontWeight: 500, fontSize: 25 }}>
                    Progreso del Grupo {params.group}
                </Typography>
            </Grid>
            <Grid container columnSpacing={1} alignItems='center' justifyContent='space-around' sx={{ bgcolor: 'secondary.main', mt: 5, borderRadius: 2, height: containerHeight }}>
                <Grid item xs={12} sm={6}>
                    <SearchBar searchQuery={nameQuery} name={'Nombre'} placeholder={'Jorge Delgado'} setSearchQuery={setNameQuery} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SearchBar searchQuery={idQuery} name={'Matrícula/Nómina'} placeholder={'A00000000'} setSearchQuery={setIdQuery} />
                </Grid>

            </Grid>
            <Grid item xs={12} sx={{ color: 'appDark.text', bgcolor: 'appDark.bgBox', height: '70vh', mt: 2, borderRadius: 2 }}>
                {Array.isArray(gridStats) && gridStats.length > 0 && (
                    <DataGrid disableColumnMenu disableHear rows={dataFiltered} columns={columns} theme={theme} sx={{ color: 'appDark.text', border: 0 }} />
                )}
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography sx={{ color: 'appDark.text', fontWeight: 500, fontSize: 25 }}>
                            Progreso General en Modulos
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ height: '80vh', mt: 5 }}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={moduleProgress}>
                                <XAxis dataKey="module" />
                                <YAxis tickFormatter={(value) => `${value}%`} label={{ value: '% Completado', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="completion" fill={theme.palette.appDark.button} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography sx={{ color: 'appDark.text', fontWeight: 500, fontSize: 25 }}>
                            Errores más Comunes
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ height: '80vh', mt: 5 }}>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={failureRate}>
                                <XAxis dataKey="module" />
                                <YAxis tickFormatter={(value) => `${value}%`} label={{ value: '% Error', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="failure_rate" fill={theme.palette.appDark.button} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const filterData = (nameQuery, idQuery, usersData) => {
    if (!nameQuery && !idQuery) {
        return usersData;
    } else {
        return usersData.filter((d) =>
            (nameQuery && d.nombre.toLowerCase().includes(nameQuery.toLowerCase())) ||
            (idQuery && d.matricula.toLowerCase().includes(idQuery.toLowerCase()))
        );
    }
};

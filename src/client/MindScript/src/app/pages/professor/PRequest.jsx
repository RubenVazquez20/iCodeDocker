import { Button, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState, useEffect } from 'react';
import { NavBar, RequestCard, SearchBar } from '../../components'
import { getAuth } from "firebase/auth";

export const PRequest = () => {
    const batmanAPI = `http://localhost:8002/`
    const theme = useTheme();

    // Api region
    const [requestsData, setRequest] = useState([]);
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
                const response = await fetch(`${batmanAPI}questionrequests?question_type=all&requested_by=${schoolID}&course=all&status=all`, options);
                const responseData = await response.json();
                setRequest(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [requestsData]);

    // Searchbar
    const [moduleQuery, setModuleQuery] = useState("");
    const [idQuery, setIdQuery] = useState("");
    const [dataFiltered, setFilter] = useState([]);


    const [buttonAccepted, setButtonAccepted] = useState(false);
    const [buttonPending, setButtonPending] = useState(false);
    const [buttonRejected, setButtonRejected] = useState(false);
    const [buttonCode, setButtonCode] = useState(false);
    const [buttonMultiOpt, setButtonMultiOpt] = useState(false);

    useEffect(() => {
        let filteredData = requestsData;

        if (buttonAccepted) {
            filteredData = filteredData.filter(request => request.status === 'APP');
        } else if (buttonPending) {
            filteredData = filteredData.filter(request => request.status === 'PEN');
        } else if (buttonRejected) {
            filteredData = filteredData.filter(request => request.status === 'REJ');
        } else if (buttonCode) {
            filteredData = filteredData.filter(request => request.type === 'codep');
        } else if (buttonMultiOpt) {
            filteredData = filteredData.filter(request => request.type === 'multi');
        }

        if (buttonAccepted && buttonCode) {
            filteredData = filteredData.filter(request => request.status === 'APP' && request.type === 'codep');
        } else if (buttonAccepted && buttonMultiOpt) {
            filteredData = filteredData.filter(request => request.status === 'APP' && request.type === 'multi');
        }

        if (buttonPending && buttonCode) {
            filteredData = filteredData.filter(request => request.status === 'PEN' && request.type === 'codep');
        } else if (buttonPending && buttonMultiOpt) {
            filteredData = filteredData.filter(request => request.status === 'PEN' && request.type === 'multi');
        }

        if (buttonRejected && buttonCode) {
            filteredData = filteredData.filter(request => request.status === 'REJ' && request.type === 'codep');
        } else if (buttonRejected && buttonMultiOpt) {
            filteredData = filteredData.filter(request => request.status === 'REJ' && request.type === 'multi');
        }

        filteredData = filterData(moduleQuery, idQuery, filteredData);
        setFilter(filteredData);
    }, [moduleQuery, idQuery, buttonAccepted, buttonPending, buttonRejected, buttonCode, buttonMultiOpt, requestsData]);


    const handleButtonAccepted = () => {
        setButtonAccepted(!buttonAccepted);
        setButtonPending(false);
        setButtonRejected(false);
        setSelected(null);
    };

    const handleButtonPending = () => {
        setButtonPending(!buttonPending);
        setButtonAccepted(false);
        setButtonRejected(false);
        setSelected(null);
    };

    const handleButtonRejected = () => {
        setButtonRejected(!buttonRejected);
        setButtonPending(false);
        setButtonAccepted(false);
        setSelected(null);
    };

    const handleButtonCode = () => {
        setButtonCode(!buttonCode);
        setButtonMultiOpt(false);
        setSelected(null);
    };

    const handleButtonMultiOpt = () => {
        setButtonMultiOpt(!buttonMultiOpt);
        setButtonCode(false);
        setSelected(null);
    };

    // 

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;
    if (user !== null) {
        //Desestructuración de user
        ({ email, displayName, emailVerified, uid } = user)
        schoolID = (user.email).substring(0, 9).toUpperCase();
    }

    const pages = [
        { name: 'Home', route: '/professor/home' },
        { name: 'Profile', route: '/professor/profile' },
    ]

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerHeight = isLargeScreen ? 100 : isMediumScreen ? 130 : 170;



    const [selected, setSelected] = useState(null);
    const handleCardSelection = (id) => {
        if (id === selected) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };

    const selectedRequest = selected !== null ? requestsData.find((r) => r.id === selected) : null;
    var js, hinputs, sinputs, options, correctOptions;
    const formattedHInputs = {};
    const formattedSInputs = {};
    const formattedOptions = {};
    const formattedCorrectOptions = {};

    if (selectedRequest != null) {
        js = JSON.parse(selectedRequest.info);
        js.status = selectedRequest.status;
        if (selectedRequest.type === 'codep') {
            hinputs = js.hinputs
            sinputs = js.sinputs
            for (const [key, value] of Object.entries(hinputs)) {
                if (Array.isArray(value)) {
                    const formattedValue = value.map(arr => arr[0]).join(',');
                    formattedHInputs[key] = formattedValue;
                } else {
                    formattedHInputs[key] = value;
                }
            }
            for (const [key, value] of Object.entries(sinputs)) {
                if (Array.isArray(value)) {
                    const formattedValue = value.map(arr => arr[0]).join(',');
                    formattedSInputs[key] = formattedValue;
                } else {
                    formattedSInputs[key] = value;
                }
            }
        }
        if (selectedRequest.type === 'multi') {
            options = js.options
            correctOptions = js.correct_option
            for (const [key, value] of Object.entries(options)) {
                if (Array.isArray(value)) {
                    const formattedValue = value.map(arr => arr[0]).join(',');
                    formattedOptions[key] = formattedValue;
                } else {
                    formattedOptions[key] = value;
                }
            }
            for (const [key, value] of Object.entries(correctOptions)) {
                if (Array.isArray(value)) {
                    const formattedValue = value.map(arr => arr[0]).join(',');
                    formattedCorrectOptions[key] = formattedValue;
                } else {
                    formattedCorrectOptions[key] = value;
                }
            }
        }
    }
    return (
        <Grid container padding={3} spacing={0} columnSpacing={1} sx={{ height: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />
            <Grid item xs={12} sx={{mt:5, height:'1vh'}}>
                <Button href={'professor/home'} sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 14 }}>
                    {'< Regresar'}
                </Button>
            </Grid>

            <Grid container columnSpacing={1} alignItems='center' justifyContent='space-around' sx={{ bgcolor: 'secondary.main', mt: 5, borderRadius: 2, height: containerHeight, ml: 1 }}>
                <Grid item xs={12} sm={6}>
                    <SearchBar searchQuery={idQuery} name={'Id'} placeholder={'TC1028'} setSearchQuery={setIdQuery} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SearchBar searchQuery={moduleQuery} name={'Modulo'} placeholder={'For Loop'} setSearchQuery={setModuleQuery} />
                </Grid>

                <Grid item xs={4} md={2}>
                    <Button
                        fullWidth
                        onClick={handleButtonAccepted}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonAccepted ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonAccepted ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonAccepted ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonAccepted ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Aceptadas
                    </Button>
                </Grid>

                <Grid item xs={4} md={2}>
                    <Button
                        fullWidth
                        onClick={handleButtonPending}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonPending ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonPending ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonPending ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonPending ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Pendientes
                    </Button>
                </Grid>

                <Grid item xs={4} md={2}>
                    <Button
                        fullWidth
                        onClick={handleButtonRejected}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonRejected ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonRejected ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonRejected ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonRejected ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Rechazadas
                    </Button>
                </Grid>

                <Grid item xs={5} md={3}>
                    <Button
                        fullWidth
                        onClick={handleButtonCode}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonCode ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonCode ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonCode ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonCode ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Código
                    </Button>
                </Grid>

                <Grid item xs={5} md={3}>
                    <Button
                        fullWidth
                        onClick={handleButtonMultiOpt}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonMultiOpt ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonMultiOpt ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonMultiOpt ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonMultiOpt ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Opción Múltiple
                    </Button>
                </Grid>

            </Grid>

            <Grid item xs={4} sx={{
                mt: 2,
                height: '65vh',
                overflowY: 'scroll',
                "&::-webkit-scrollbar": {
                    width: 5,
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                    borderRadius: 2,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "appDark.scrollBar",
                    borderRadius: 2,
                },
            }}>
                <Grid container rowSpacing={1}>
                    {dataFiltered.map((r) => (
                        <Grid key={r.id} item xs={12}>
                            <RequestCard request={r} setSelected={handleCardSelection} selected={selected === r.id} />
                        </Grid>
                    ))}
                </Grid>

            </Grid>

            <Grid item xs={8} sx={{ mt: 2 }}>
                {selectedRequest != null && selectedRequest.type === 'codep' && (
                    <Grid container sx={{
                        bgcolor: 'secondary.main',
                    }}>
                        <Grid item xs={12} paddingX={5} sx={{ mt: '5vh' }}>
                            <Grid container justifyContent='space-between'>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 25 }} >
                                        Detalles del Problema
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} align='right'>
                                    {js.status === 'APP' && (
                                        <Typography sx={{ color: 'appDark.approved', fontSize: 25 }} >
                                            Aceptado
                                        </Typography>
                                    )}
                                    {js.status === 'PEN' && (
                                        <Typography sx={{ color: 'appDark.pending', fontSize: 25 }} >
                                            Pendiente
                                        </Typography>
                                    )}
                                    {js.status === 'REJ' && (
                                        <Typography sx={{ color: 'appDark.rejected', fontSize: 25 }} >
                                            Rechazado
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{
                            height: '55vh',
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
                            <Grid container spacing={0} paddingX={8}>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Descripción</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.description}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Lenguaje</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.language}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Funciones Prohibidas</li>
                                    </Typography>
                                    {js.forbiddenFunctions.length > 0 ?
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            {js.forbiddenFunctions}
                                        </Typography>
                                        :
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            No hay funciones prohibidas
                                        </Typography>
                                    }
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Código Inicial</li>
                                    </Typography>
                                    {js.initialCode.length > 0 ?
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            {js.initialCode}
                                        </Typography>
                                        :
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            No hay código inicial
                                        </Typography>
                                    }
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Inputs Privados</li>
                                    </Typography>
                                    {Object.entries(formattedHInputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Outputs Privados</li>
                                    </Typography>
                                    {Object.entries(js.houtputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Inputs Públicos</li>
                                    </Typography>
                                    {Object.entries(formattedSInputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Outputs Públicos</li>
                                    </Typography>
                                    {Object.entries(js.soutputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Tiempos Máximo de Ejecución</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.timeoutSec} seg
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                )}

                {selectedRequest != null && selectedRequest.type === 'multi' && (
                    <Grid container sx={{
                        bgcolor: 'secondary.main',
                    }}>
                        <Grid item xs={12} paddingX={5} sx={{ mt: '5vh' }}>
                            <Grid container justifyContent='space-between'>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 25 }} >
                                        Detalles del Problema
                                    </Typography>
                                </Grid>

                                <Grid item xs={6} align='right'>
                                    {js.status === 'APP' && (
                                        <Typography sx={{ color: 'appDark.approved', fontSize: 25 }} >
                                            Aceptado
                                        </Typography>
                                    )}
                                    {js.status === 'PEN' && (
                                        <Typography sx={{ color: 'appDark.pending', fontSize: 25 }} >
                                            Pendiente
                                        </Typography>
                                    )}
                                    {js.status === 'REJ' && (
                                        <Typography sx={{ color: 'appDark.rejected', fontSize: 25 }} >
                                            Rechazado
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{
                            height: '55vh',
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
                            <Grid container spacing={0} paddingX={8}>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Pregunta</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.question}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Número de Opciones</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.n_options}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Opciones</li>
                                    </Typography>
                                    {Object.entries(formattedOptions).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {value}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Respuesta Correcta</li>
                                    </Typography>
                                    {Object.entries(formattedCorrectOptions).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {value}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Explicación</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.explanation}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid >

    )
}

const filterData = (moduleQuery, idQuery, requestData) => {
    if (!moduleQuery && !idQuery) {
        return requestData;
    } else {
        return requestData.filter((d) => {
            return (
                (moduleQuery && d.module.toLowerCase().includes(moduleQuery.toLowerCase())) ||
                (idQuery && d.course.toLowerCase().includes(idQuery.toLowerCase()))
            );
        });
    }
};
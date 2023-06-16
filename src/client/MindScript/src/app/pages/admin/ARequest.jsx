import { Button, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react';
import { NavBar, RequestCard, Confirmation } from '../../components'

export const ARequest = () => {
    const batmanAPI = `http://localhost:8002/`
    const riddleAPI = `http://localhost:8003/`

    const pages = [
        { name: 'Gestion de Usuarios', route: '/admin/management' },
        { name: 'Solicitudes', route: '/admin/request' },
        { name: 'Plan de Estudios', route: '/admin/syllabus' }
    ]


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
                const response = await fetch(`${batmanAPI}questionrequests?question_type=all&requested_by=all&course=all&status=pending`, options);
                const responseData = await response.json();
                setRequest(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);
    const handleDecline = async (id) => {
        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',

            };

            const response = await fetch(`${riddleAPI}declineQuestionRequest/${id}`, options);
            setRequest(prevData => prevData.filter(request => request.id !== id));
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            };

            const response = await fetch(`${riddleAPI}aproveQuestionRequest/${id}`, options);
            setRequest(prevData => prevData.filter(request => request.id !== id));
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    const [selected, setSelected] = useState(null);
    const handleCardSelection = (id) => {
        if (id === selected) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };
    //Funciones para abrir la modal de Eliminar solicitud
    const [openDeclineRequest, setOpenDeclineRequest] = useState(false);
    const showModalDeclineRequest = () => { setOpenDeclineRequest(true); }
    const closeModalDeclineRequest = () => {
        setOpenDeclineRequest(false);
    }
    //Funciones para abrir la modal de Aceptar solicitud
    const [openApproveRequest, setOpenApproveRequest] = useState(false);
    const showModalApproveRequest = () => { setOpenApproveRequest(true); }
    const closeModalApproveRequest = () => {
        setOpenApproveRequest(false);
    }

    const selectedRequest = selected !== null ? requestsData.find((r) => r.id === selected) : null;
    var js, hinputs, sinputs, options, correctOptions;
    const formattedHInputs = {};
    const formattedSInputs = {};
    const formattedOptions = {};
    const formattedCorrectOptions = {};

    if (selectedRequest != null) {
        js = JSON.parse(selectedRequest.info);
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
            < Confirmation open={openDeclineRequest} close={closeModalDeclineRequest} id={selected} confirmationText="¿Esta seguro que desea rechazar esta solicitud?" handleFunction={handleDecline} confirmationTextButton="Rechazar" />
            < Confirmation open={openApproveRequest} close={closeModalApproveRequest} id={selected} confirmationText="¿Esta seguro que desea aceptar esta solicitud?" handleFunction={handleApprove} confirmationTextButton="Aceptar" />

            <Grid item xs={4} sx={{
                mt: 5,
                height: '90vh',
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
                    {requestsData.map((r) => (
                        <Grid key={r.id} item xs={12}>
                            <RequestCard request={r} setSelected={handleCardSelection} selected={selected === r.id} />
                        </Grid>
                    ))}
                </Grid>

            </Grid>

            <Grid item xs={8} sx={{ mt: 5 }}>
                {selectedRequest != null && selectedRequest.type === 'codep' && (
                    <Grid container sx={{
                        bgcolor: 'secondary.main',
                    }}>
                        <Grid item xs={12} paddingX={5} sx={{ mt: '5vh' }}>
                            <Typography sx={{ color: 'appDark.text', fontSize: 25 }} >
                                Detalles del Problema
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sx={{
                            height: '65vh',
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

                        <Grid item xs={12}>
                            <Grid container justifyContent='flex-end' columnSpacing={5} padding='5vh'>
                                <Grid item>
                                    <Button type="submit"
                                        onClick={showModalApproveRequest}
                                        sx={{
                                            color: 'appDark.text',
                                            bgcolor: 'transparent',
                                            border: 0.5,
                                            borderColor: 'appDark.box',
                                            '&:hover': { bgcolor: 'appDark.adminButton', borderColor: 'transparent' },
                                            borderRadius: 5,
                                        }}>
                                        Aceptar
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button type="submit"
                                        onClick={showModalDeclineRequest}
                                        sx={{
                                            color: 'appDark.text',
                                            bgcolor: 'transparent',
                                            border: 0.5,
                                            borderColor: 'appDark.box',
                                            '&:hover': { bgcolor: 'appDark.adminButton', borderColor: 'transparent' },
                                            borderRadius: 5,
                                        }}>
                                        Rechazar
                                    </Button>
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
                            <Typography sx={{ color: 'appDark.text', fontSize: 25 }} >
                                Detalles del Problema
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sx={{
                            height: '65vh',
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

                        <Grid item xs={12}>
                            <Grid container justifyContent='flex-end' columnSpacing={5} padding='5vh'>
                                <Grid item>
                                    <Button type="submit"
                                        onClick={showModalApproveRequest}
                                        sx={{
                                            color: 'appDark.text',
                                            bgcolor: 'transparent',
                                            border: 0.5,
                                            borderColor: 'appDark.box',
                                            '&:hover': { bgcolor: 'appDark.adminButton', borderColor: 'transparent' },
                                            borderRadius: 5,
                                        }}>
                                        Aceptar
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button type="submit"
                                        onClick={showModalDeclineRequest}
                                        sx={{
                                            color: 'appDark.text',
                                            bgcolor: 'transparent',
                                            border: 0.5,
                                            borderColor: 'appDark.box',
                                            '&:hover': { bgcolor: 'appDark.adminButton', borderColor: 'transparent' },
                                            borderRadius: 5,
                                        }}>
                                        Rechazar
                                    </Button>
                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>
                )}
            </Grid>
        </Grid >

    )
}

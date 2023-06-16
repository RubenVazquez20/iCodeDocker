import { Delete } from '@mui/icons-material';
import { Grid, InputLabel, Modal, OutlinedInput, Button, Typography, useTheme, useMediaQuery, IconButton } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from 'react';
import { Confirmation } from './Confirmation';

export const EditCourse = ({ open, close, params }) => {
    const theme = useTheme();
    const batmanAPI = `http://localhost:8002/`

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerWidth = isLargeScreen ? 40 : isMediumScreen ? 70 : 90;

    const [error, setError] = useState(null);
    const [modulesData, setModule] = useState([]);
    const [copyModulesData, setCopyModule] = useState([]);
    const [idData, setId] = useState([]);
    const [nameData, setName] = useState([]);

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
                const response = await fetch(`${batmanAPI}coursemodules/${params.id}`, options);
                const responseData = await response.json();
                setModule(responseData);
                setCopyModule(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [params.id, open]);

    const handlePrevDelete = (id) => {
        setId(prevData => [...prevData, id]);
        return setModule(prevData => prevData.filter(module => module.id !== id));
    }

    const handleDelete = async (id) => {
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',

            };
            const response = await fetch(`${batmanAPI}module/${id}`, options);
            setModule(prevData => prevData.filter(module => module.id !== id));
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const handlePatch = async (id) => {
        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": id,
                    "new_name": newCourseName
                }),
                mode: 'cors',
            };

            const response = await fetch(`${batmanAPI}coursename`, options);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const handleFunctions = async (id) => {
        const idCourse = id[0];
        const idModules = id.slice(1);
        let response;

        if (modulesData !== copyModulesData) {
            await Promise.all(
                idModules.map(async (idMod) => {
                    response = await handleDelete(idMod);
                })
            );
        }

        if (nameData !== newCourseName) {
            response = await handlePatch(idCourse);
        }

        if(response.ok){
            close();
        }

        return response;
    };

    const moduleControls = Array.isArray(modulesData) && modulesData.length > 0 ?
        modulesData.map((module) => (
            <div key={module.id} style={{ display: 'flex', justifyContent: 'space-between' }}>

                <FormControl key={module.id} sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}>
                    <InputLabel
                        sx={{
                            color: 'appDark.text',
                            '&.Mui-focused': {
                                color: 'appDark.text'
                            }
                        }}
                    >
                        Nombre del Módulo
                    </InputLabel>
                    <OutlinedInput
                        type="input"
                        label="Nombre del Módulo"
                        placeholder="Módulo 1"
                        value={module.name}
                        sx={{
                            color: 'appDark.text',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'appDark.box',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'appDark.box',
                            },
                            '&.MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                            }
                        }}
                    />
                </FormControl>
                <div style={{ padding: 10, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div style={{ backgroundColor: theme.palette.error.main, marginTop: 15, borderRadius: 5 }}>
                        <IconButton
                            sx={{ color: 'appDark.icon' }}
                            onClick={() => handlePrevDelete(module.id)}
                        >
                            <Delete />
                        </IconButton>

                    </div>
                </div>
            </div >
        )) : null;

    //Funciones para abrir la modal de Actualizar Curso
    const [openEditCourse, setOpenEditCourse] = useState(false);
    const showModalEditCourse = () => { setOpenEditCourse(true); }
    const closeModalEditCourse = () => {
        setOpenEditCourse(false);
    }

    const [newCourseName, setNewCourseName] = useState(params?.name || '');

    useEffect(() => {
        setName(params?.name || '');
        setNewCourseName(params?.name || '');
        setId([params?.id] || []);
        setError(null);
    }, [params?.name, params?.id, open]);

    return (
        <>
            <Confirmation open={openEditCourse} close={closeModalEditCourse} handleFunction={handleFunctions} id={idData} confirmationText="¿Está seguro que desea guardar los cambios?" confirmationTextButton="Guardar" />
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="editarCurso"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Grid container
                    id="Grid container Editar Materia"
                    justifyContent='center'
                    sx={{
                        bgcolor: 'secondary.main',
                        borderRadius: 2,
                        boxShadow: 24,
                        width: `${containerWidth}vw`,
                    }}>

                    <Grid item xs={12}>
                        <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                            Editar Curso
                        </Typography>
                    </Grid>

                    <Grid item xs={10}>
                        <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, mt: 2, ml: 1 }}>
                            Información General {params.id}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent="center" sx={{
                            py: 2,
                            height: '60vh',
                        }}>

                            <Grid item xs={10} >
                                <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 1 }}>
                                    <InputLabel sx={{
                                        color: 'appDark.text',
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}>Nombre del Curso</InputLabel>
                                    <OutlinedInput
                                        type="input"
                                        label="Nombre del Curso"
                                        placeholder="Pensamiento Computacional"
                                        value={newCourseName}
                                        onChange={(e) => setNewCourseName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))}
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
                                            }
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 1 }}>
                                    Módulos
                                </Typography>
                            </Grid>


                            <Grid item xs={10} sx={{
                                height: '30vh',
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
                                {moduleControls}

                            </Grid>

                        </Grid>

                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent='space-around' align='center' sx={{ mb: 2 }}>
                            <Grid item xs={6} id="cancelar" >
                                <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                    Cancelar
                                </Button>
                            </Grid>
                            <Grid item xs={6} id="crear tarea">
                                <Button onClick={showModalEditCourse} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                    Guardar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Modal>
        </>
    )
}
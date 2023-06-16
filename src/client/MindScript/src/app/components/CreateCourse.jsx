import { Add, Delete } from '@mui/icons-material';
import { Grid, InputLabel, Modal, OutlinedInput, Button, Typography, IconButton, useTheme, useMediaQuery, FormHelperText } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from 'react';

export const CreateCourse = ({ open, close, onCreateCourse }) => {

    const theme = useTheme();
    const batmanAPI = `http://localhost:8002/`

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const containerWidth = isLargeScreen ? 40 : isMediumScreen ? 65 : 90;

    const [id, setId] = useState('');
    const [courseName, setCourse] = useState('');
    const [modules, setModule] = useState([]);
    const [modulesInput, setInput] = useState([]);
    const [idError, setIdError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const handleCreate = async () => {
        if (!id || !courseName || modulesInput.some((input) => !input)) {
            return;
        }
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": id,
                    "name": courseName,
                    "modules": modulesInput
                }),
                mode: 'cors',
            };

            const response = await fetch(`${batmanAPI}course`, options);
            if (response.ok) {
                close();
                const courseData = {
                    id: id,
                    name: courseName,
                    n_modules: modulesInput.length,
                };
                onCreateCourse(courseData);
            }
            if (response.status === 408) {
                throw new Error('ID ya existe')
            }
            if (response.status === 409) {
                throw new Error('Nombre ya existe')
            }
            if (response.status === 410) {
                throw new Error('ID y Nombre ya existen')
            }
            return response.json;
        } catch (error) {
            if (error.message === 'ID ya existe') {
                setIdError(error.message);
                setNameError(null);
            }
            if (error.message === 'Nombre ya existe') {
                setIdError(null);
                setNameError(error.message);
            }
            if (error.message === 'ID y Nombre ya existen') {
                setIdError('ID ya existe');
                setNameError('Nombre ya existe');
            }
        }
    };

    useEffect(() => {
        if (open) {
            addModuleControl();
        } else {
            setModule([]);
            setInput([]);
            setId('');
            setCourse('');
            setIdError(null);
            setNameError(null);
        }
    }, [open]);

    const handleIdChange = (event) => {
        const { value } = event.target;
        const validValue = value.toUpperCase().substring(0,6);
        setId(validValue);
    };

    const handleCourseChange = (event) => {
        const { value } = event.target;
        const capitalizedValue = value.replace(/\b\w/g, (c) => c.toUpperCase());
        setCourse(capitalizedValue);
    };


    const handleModuleChange = (moduleId, event) => {
        setModule((prevModules) => {
            const updatedModules = prevModules.map((module) => {
                if (module.key === moduleId) {
                    return {
                        ...module,
                        input: event.target.value,
                    };
                }
                return module;
            });

            const updatedInputs = updatedModules.map((module) => module.input);
            setInput(updatedInputs);

            return updatedModules;
        });
    };


    const deleteModuleControl = (moduleId) => {
        setModule((prevModules) => {
            if (prevModules.length === 1 && prevModules[0].key === moduleId) {
                return prevModules;
            }

            const updatedModules = prevModules.filter((module) => module.key !== moduleId);

            const updatedInputs = updatedModules.map((module) => module.input);
            setInput(updatedInputs);

            return updatedModules;
        });
    };

    const addModuleControl = () => {
        const id = Date.now();
        const newModule = {
            key: id,
            jsx: (
                <Grid item xs={12} key={id}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={9}>
                            <FormControl
                                sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}
                            >
                                <InputLabel
                                    required
                                    sx={{
                                        color: 'appDark.text',
                                        '&.Mui-focused': {
                                            color: 'appDark.text',
                                        },
                                    }}
                                >
                                    Añadir Módulo
                                </InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="Nombre del Curso"
                                    placeholder="For loop"
                                    value={modules.input}
                                    onChange={(event) => handleModuleChange(id, event)}
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
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={3} sx={{ mt: 2 }}>
                            <Grid container align="center" justifyContent="space-around">
                                <Grid item xs={5} sx={{ bgcolor: 'appDark.button', borderRadius: 2 }}>
                                    <IconButton sx={{ color: 'appDark.icon' }} onClick={addModuleControl}>
                                        <Add />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={5} sx={{ bgcolor: 'error.main', borderRadius: 2 }}>
                                    <IconButton
                                        sx={{ color: 'appDark.icon' }}
                                        onClick={() => deleteModuleControl(id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ),
        };

        setModule((prevModules) => [...prevModules, newModule]);
    };

    return (
        <Modal
            id="Modal prrona Crear Tarea"
            open={open}
            onClose={close}
            aria-labelledby="crearCurso"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                id="Grid container Crear Materia"
                justifyContent='center'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: `${containerWidth}vw`,
                }}>

                <Grid item xs={12} id="PrimeraSección">
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Crear Materia
                    </Typography>
                </Grid>

                <Grid item xs={10}>
                    <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, mt: 2, ml: 1 }}>
                        Información General
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" sx={{
                        py: 3,
                        height: '60vh',
                    }}>

                        <Grid item xs={10} >
                            <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%' }}>
                                <InputLabel required sx={{
                                    color: 'appDark.text',
                                    '&.Mui-focused': {
                                        color: 'appDark.text' //change label color
                                    }
                                }}>ID del Curso</InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="ID del Curso"
                                    placeholder="TC1028"
                                    value={id}
                                    onChange={handleIdChange}
                                    error={idError !== null}
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
                            {idError && (<FormHelperText sx={{ color: 'error.main', mx: 1 }}>{idError}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={10} >
                            <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}>
                                <InputLabel required sx={{
                                    color: 'appDark.text',
                                    '&.Mui-focused': {
                                        color: 'appDark.text' //change label color
                                    }
                                }}>Nombre del Curso</InputLabel>
                                <OutlinedInput
                                    type="text"
                                    label="Nombre del Curso"
                                    placeholder="Pensamiento Computacional"
                                    value={courseName}
                                    onChange={handleCourseChange}
                                    error={nameError !== null}
                                    inputProps={{
                                        autoCapitalize: 'words',
                                    }}
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
                            {nameError && (<FormHelperText sx={{ color: 'error.main', mx: 1 }}>{nameError}</FormHelperText>)}

                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 2 }}>
                                Módulos
                            </Typography>
                        </Grid>
                        <Grid item xs={10} sx={{
                            overflowY: 'scroll',
                            height: '30vh',
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
                            {modules.map((module) => module.jsx)}
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
                            <Button onClick={handleCreate} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                Crear Materia
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    )
}
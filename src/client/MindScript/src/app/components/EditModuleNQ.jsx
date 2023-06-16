import { Delete } from '@mui/icons-material';
import { Grid, InputLabel, Modal, OutlinedInput, Button, Typography, MenuItem, useTheme, useMediaQuery, IconButton } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';


export const EditModuleNQ = ({ open, close, moduleData, group }) => {
    const theme = useTheme();
    const batmanAPI = `http://localhost:8002/`

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerWidth = isLargeScreen ? 40 : isMediumScreen ? 70 : 90;


    //Num de ejercicios
    const { qnumber, onInputChange } = useForm({
        qnumber: '',
    });


    //Endpoint para modificar el número de preguntas de un módulo para un grupo específico
    const editNumberofQuestions = () => {

        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',

            body: JSON.stringify({
                "group": group,
                "module": moduleData.id,
                "n_questions": parseInt(qnumber)
            })
        }
        console.log(options)

        fetch(`${batmanAPI}modulenquestions`, options)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                // console.log(error)
            })

    };


    return (
        <Modal
            id="Modal prrona Editar Numero de Preguntas Modulo"
            open={open}
            onClose={close}
            aria-labelledby="editarNModule"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                id="editarNmodule"
                justifyContent='center'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: `${containerWidth}vw`,
                }}>

                <Grid item xs={12}>
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Editar: {moduleData.name}
                    </Typography>
                </Grid>

                <Grid item xs={10} >
                    {/* Tabla de ejercicios de modulos */}
                    <Grid container justifyContent='space-around' alignItems='center' sx={{ my: 2 }}>
                        <Grid item xs={4} id="cancelar" justifyContent="center" alignContent="center">
                            <Typography id="ejercicios" align='center' variant="h5" component="h5" sx={{ color: 'appDark.text', fontSize: 16, fontWeight: 500 }}>
                                Ejercicios
                            </Typography>
                        </Grid>

                        <Grid item xs={4} id="ejercicios" justifyContent="center" align='center'  >
                            <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '50%', height: '100%' }}>
                                <InputLabel

                                    sx={{
                                        color: 'appDark.text',
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}></InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label=""
                                    placeholder={moduleData.n_questions}
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
                                    name='qnumber'
                                    value={qnumber}
                                    onChange={onInputChange}

                                />
                            </FormControl>
                        </Grid>
                    </Grid>



                </Grid>
                {/* </Grid>
                </Grid> */}


                <Grid item xs={12}>
                    <Grid container justifyContent='space-around' align='center' sx={{ mb: 2 }}>
                        <Grid item xs={6} id="cancelar" >
                            <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs={6} id="crear tarea">
                            <Button
                                onClick={() => {
                                    editNumberofQuestions()
                                    close()
                                }}
                                type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    )
}
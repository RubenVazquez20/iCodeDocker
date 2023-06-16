import { Grid, InputLabel, OutlinedInput, IconButton} from '@mui/material'
import { Add, Delete } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';

import { useState } from 'react';
import { useEffect } from 'react';

export const AddMultiQ = ({open, changeMultiQ}) => {
    const [multiQs, setMultiQ] = useState([]);
    const [multiQsInput, setInput] = useState([]);

    useEffect(() => {
        // addMultiQControl();
        if (open) {
            setMultiQ([]);
            setInput([]);
            addMultiQControl();
        } 
        // else {
        //     setMultiQ([]);
        //     setInput([]);
        // }
    }, [open]);


    //Para la seccion de input
    const handleMultiQChange = (multiQId, event) => {
        setMultiQ((prevMultiQs) => {
            const updatedMultiQs = prevMultiQs.map((multiQ) => {
                if (multiQ.key === multiQId) {
                    return {
                        ...multiQ,
                        opcion: event.target.value,
                    };
                }
                return multiQ;
            });

            const updatedInputs = updatedMultiQs.map((multiQ) => multiQ.input);
            setInput(updatedInputs);

            // {console.log("asksajsaklxjsa",updatedMultiQs)}
            changeMultiQ(updatedMultiQs);
            // changeMultiQ=updatedMultiQs;
            return updatedMultiQs;
        });
    };

    const deleteMultiQControl = (multiQId) => {
        setMultiQ((prevMultiQs) => {
            if (prevMultiQs.length === 1 && prevMultiQs[0].key === multiQId) {
                return prevMultiQs;
            }

            const updatedMultiQs = prevMultiQs.filter((multiQ) => multiQ.key !== multiQId);

            const updatedInputs = updatedMultiQs.map((multiQ) => multiQ.input);
            setInput(updatedInputs);

            changeMultiQ(updatedMultiQs);
            // changeMultiQ=updatedMultiQs;
            return updatedMultiQs;
        });
    };

    const addMultiQControl = () => {
        const id = Date.now();
        const newMultiQ = {
            key: id,
            jsx: (
                <Grid item xs={11} key={id}
                >
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
                                        height: 100
                                    }}
                                >
                                    {"Añadir opción"}
                                </InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="Nombre del Curso"
                                    placeholder="Opción"
                                    multiline={true}
                                    value={multiQs.opcion}
                                    onChange={(event) => handleMultiQChange(id, event)}
                                    sx={{
                                        color: 'appDark.text',
                                        height: 100,
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
                            <Grid container justifyContent="space-around">
                                <Grid item xs={12} sx={{ bgcolor: 'appDark.button', borderRadius: 2, ml: 2 }}>
                                    <IconButton sx={{ color: 'appDark.icon' }} onClick={addMultiQControl}>
                                        <Add />
                                    </IconButton>
                                </Grid>
                                <Grid item justifyContent="center" xs={12} sx={{ bgcolor: 'error.main', borderRadius: 2, mt: 2, ml: 2 }}>
                                    <IconButton
                                        sx={{ color: 'appDark.icon' }}
                                        onClick={() => deleteMultiQControl(id)}
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

        setMultiQ((prevMultiQs) => [...prevMultiQs, newMultiQ]);
        // changeMultiQ((prevMultiQs) => [...prevMultiQs, newMultiQ]);
    };

    return multiQs.map((multiQ) => multiQ.jsx)
}
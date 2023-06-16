import { Grid, InputLabel, OutlinedInput, IconButton} from '@mui/material'
import { Add, Delete } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';

import { useState } from 'react';
import { useEffect } from 'react';

export const AddTestCasesIC = ({open, changeTestCase, type}) => {
    const [testCases, setTestCase] = useState([]);
    const [testCasesInput, setInput] = useState([]);

    useEffect(() => {
        if (open) {
            addTestCaseControl();
        } else {
            setTestCase([]);
            setInput([]);
        }
    }, [open]);

    //Para la seccion de input
    const handleTestCaseChange = (testCaseId, event) => {
        setTestCase((prevTestCases) => {
            const updatedTestCases = prevTestCases.map((testCase) => {
                if (testCase.key === testCaseId) {
                    return {
                        ...testCase,
                        input: event.target.value,
                    };
                }
                return testCase;
            });

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            // {console.log("asksajsaklxjsa",updatedTestCases)}
            changeTestCase(updatedTestCases);
            // changeTestCase=updatedTestCases;
            return updatedTestCases;
        });
    };

    const deleteTestCaseControl = (testCaseId) => {
        setTestCase((prevTestCases) => {
            if (prevTestCases.length === 1 && prevTestCases[0].key === testCaseId) {
                return prevTestCases;
            }

            const updatedTestCases = prevTestCases.filter((testCase) => testCase.key !== testCaseId);

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            changeTestCase(updatedTestCases);
            // changeTestCase=updatedTestCases;
            return updatedTestCases;
        });
    };

    const addTestCaseControl = () => {
        const id = Date.now();
        const newTestCase = {
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
                                    {"Añadir "+type}
                                </InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="Nombre del Curso"
                                    placeholder="Input"
                                    multiline={true}
                                    value={testCases.input}
                                    onChange={(event) => handleTestCaseChange(id, event)}
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
                                    <IconButton sx={{ color: 'appDark.icon' }} onClick={addTestCaseControl}>
                                        <Add />
                                    </IconButton>
                                </Grid>
                                <Grid item justifyContent="center" xs={12} sx={{ bgcolor: 'error.main', borderRadius: 2, mt: 2, ml: 2 }}>
                                    <IconButton
                                        sx={{ color: 'appDark.icon' }}
                                        onClick={() => deleteTestCaseControl(id)}
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

        setTestCase((prevTestCases) => [...prevTestCases, newTestCase]);
        // changeTestCase((prevTestCases) => [...prevTestCases, newTestCase]);
    };

    return (
        // <Grid item xs={5}>
        //     {console.log("test cases",testCases)}
        //     {testCases.map((testCase) => testCase.jsx)}
        //  </Grid>
            (testCases.map((testCase) => testCase.jsx))
        
    )
}
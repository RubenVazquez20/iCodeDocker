import { Grid, InputLabel, OutlinedInput, IconButton} from '@mui/material'
import { Add, Delete } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';

import { useState } from 'react';
import { useEffect } from 'react';

export const AddTestCases = ({open, changeTestCase}) => {
    const [testCases, setTestCase] = useState([]);
    const [testCasesInput, setInput] = useState([]);

    useEffect(() => {
        // addTestCaseControl();
        if (open) {
            setTestCase([]);
            setInput([]);
            addTestCaseControl();
        } 
        // else {
        //     setTestCase([]);
        //     setInput([]);
        // }
    }, [open]);

    const handleTestCaseChangeI = (testCaseId, event) => {
        setTestCase((prevTestCases) => {
            const updatedTestCases = prevTestCases.map((testCase) => {
                if (testCase.key === testCaseId) {
                    console.log("ekedkwld", testCase)
                    return {
                        ...testCase,
                        input: event.target.value,
                    };
                }
                return testCase;
            });

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            changeTestCase(updatedTestCases)
            return updatedTestCases;
        });
    };

    const handleTestCaseChangeO = (testCaseId, event) => {
        setTestCase((prevTestCases) => {
            const updatedTestCases = prevTestCases.map((testCase) => {
                if (testCase.key === testCaseId) {
                    return {
                        ...testCase,
                        output: event.target.value,
                    };
                }
                return testCase;
            });

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            changeTestCase(updatedTestCases)
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

            changeTestCase(updatedTestCases)
            return updatedTestCases;
        });
    };

    const addTestCaseControl = () => {
        const id = Date.now();
        const newTestCase = {
            key: id,
            jsx: (
                <Grid item xs={12} key={id}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={10}>
                            <Grid container>
                                <Grid item xs={6} sx={{ pr: 1 }}>
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
                                            Añadir Input
                                        </InputLabel>
                                        <OutlinedInput
                                            type="input"
                                            label="Nombre del Curso"
                                            placeholder="Input"
                                            multiline={true}
                                            value={testCases.input}
                                            onChange={(event) => handleTestCaseChangeI(id, event)}
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

                                <Grid item xs={6} sx={{ pr: 1 }}>
                                    <FormControl
                                        sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}>
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
                                            Añadir Output
                                        </InputLabel>
                                        <OutlinedInput
                                            type="input"
                                            label="Nombre del Curso"
                                            placeholder="Output"
                                            multiline={true}
                                            value={testCases.output}
                                            onChange={(event) => handleTestCaseChangeO(id, event)}
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
                            </Grid>
                        </Grid>

                        <Grid item xs={2} sx={{ mt: 2 }}>
                            <Grid container align="center" justifyContent="space-around">
                                <Grid item xs={7} sx={{ bgcolor: 'appDark.button', borderRadius: 2 }}>
                                    <IconButton sx={{ color: 'appDark.icon' }} onClick={addTestCaseControl}>
                                        <Add />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={7} sx={{ bgcolor: 'error.main', borderRadius: 2, mt: 2 }}>
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
    };

    return (
        (testCases.map((testCase) => testCase.jsx))
    )
}
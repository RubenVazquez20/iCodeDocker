import { Grid, InputLabel, OutlinedInput, IconButton, Typography} from '@mui/material'
import { Add, Delete } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';

import { useState } from 'react';
import { useEffect } from 'react';

import { AddTestCasesIC } from './';

export const AddTestCasesOC = ({open, changeTestCase, type}) => {
    const [testCases, setTestCase] = useState([]);
    const [testCasesInput, setInput] = useState([]);

    const [testCasesI, setTestCaseI] = useState([]);
    const changeTestCaseI = (newTestCaseI) => {
        setTestCaseI(newTestCaseI);
    }

    useEffect(() => {
        if (open) {
            addTestCaseControl();
        } else {
            setTestCase([]);
            setInput([]);
            setTestCaseI([]);
        }
    }, [open]);

    // function callInput() {
    //    return <AddTestCasesIC open={open} changeTestCase={changeTestCaseI} type={"input"} onChange={console.log("se esta actualizando")}/>
    // }

    const callInput = <AddTestCasesIC open={open} changeTestCase={changeTestCaseI} type={"input"} />

    // setInterval(function(){ 
    //     //code goes here that will be run every 5 seconds.
    //     testCases.map((testCase) => {
    //         (testCase.input).map((oldI) => {
    //             (callInput._owner.memoizedState.next.next.baseState).map((newI) => {
    //                 if ((oldI.key === newI.key) && (oldI.input != newI.imput)){
    //                     oldI = newI;
    //                     // console.log("old ", oldI.input, "new ", newI.input)
    //                 }
    //             })
    //         })
    //     })    
    // }, 2000);


    
        

    //Para la seccion de input
    const handleTestCaseChange = (testCaseId, event) => {
        // console.log("ddddd",callInput._owner.memoizedState.next.next.baseState);
        setTestCase((prevTestCases) => {
            const updatedTestCases = prevTestCases.map((testCase) => {
                if (testCase.key === testCaseId) {
                    // {console.log("testCasesI",testCasesI)}
                    // testCase.jsx
                    return {
                        ...testCase,
                        output: event.target.value,
                        // input: testCasesI,
                        input: callInput._owner.memoizedState.next.next.baseState,
                    };
                }
                return testCase;
            });

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            changeTestCase(updatedTestCases);
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
            return updatedTestCases;
        });
    };

    const addTestCaseControl = () => {
        const id = Date.now();
        const newTestCase = {
            key: id,
            input: [],
            jsx: (
                <>
                    <Grid xs={6}
                        sx={{
                            overflowY: 'scroll',
                            height: '25vh',
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
                            mt: 2
                        }}
                    >
                        {callInput}
                        {/* <AddTestCasesIC open={open} changeTestCase={changeTestCaseI} type={"input"} onChange={console.log("se esta actualizando")}/> */}
                        {/* {console.log("testCasesI",testCasesI)} */}
                    </Grid>
                    <Grid item xs={5} key={id} sx={{mt: 2}}>
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
                                        value={testCases.output}
                                        onChange={(event) =>
                                            setInterval(function(){ 
                                                handleTestCaseChange(id, event)
                                            }, 2000)}
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
                </>
            ),
        };

        setTestCase((prevTestCases) => [...prevTestCases, newTestCase]);
        // changeTestCase((prevTestCases) => [...prevTestCases, newTestCase]);
    };

    return (
        // <>
        //     <Grid item xs={12}>
        //         {/* {console.log("test cases",testCases)} */}
        //         {testCases.map((testCase) => testCase.jsx)}
        //     </Grid>
        // </>
        (testCases.map((testCase) => testCase.jsx))
        // <>
        // <AddTestCasesIC open={open} changeTestCase={changeTestCaseI} type={"input"}/>
        // {console.log("dsdshg",testCasesI)}
        // </>

        // (testCases.map((testCase) => {
        //     <>
        //     <Grid xs={6}
        //                     sx={{
        //                         overflowY: 'scroll',
        //                         height: '25vh',
        //                         "&::-webkit-scrollbar": {
        //                             width: 5,
        //                         },
        //                         "&::-webkit-scrollbar-track": {
        //                             backgroundColor: "secondary.main",
        //                             borderRadius: 2,
        //                         },
        //                         "&::-webkit-scrollbar-thumb": {
        //                             backgroundColor: "appDark.scrollBar",
        //                             borderRadius: 2,
        //                         },
        //                         mt: 2
        //                     }}
        //                 >
        //                     <AddTestCasesIC open={open} changeTestCase={changeTestCaseI} type={"input"}/>
        //                     {console.log("testCasesI",testCasesI)}
        //     </Grid>
        //     <Grid>
        //        <Typography>{ testCase.jsx}</Typography>
        //     </Grid>
        //     </>
        // }))

        
    )
}
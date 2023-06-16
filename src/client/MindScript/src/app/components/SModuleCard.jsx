import { Card, CardContent, CardActionArea, Typography, Grid, IconButton, LinearProgress } from '@mui/material'
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { LockOutlined } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { Link, useParams } from 'react-router-dom';

export const SModuleCard = ({ module, index, group }) => {
    const riddleAPI = `http://localhost:8003/`

    const colors = ["#C12C45", "#5EC1F3", "#55D16E", "#FACD34"]
    const color = index - (colors.length * parseInt(index / colors.length));

    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid, responseInfo, path;

    if (user !== null) {
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Matrícula ", schoolID)
    }

    let params = useParams()
    // console.log(params.course)


    const [question, setQuestion] = useState([]);
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
                const response = await fetch(`${riddleAPI}questions?id_assigment=${module.id}&id_student=${schoolID}&id_group=${group}`, options);
                const responseData = await response.json();
                setQuestion(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    if (module.progress === 100) {
        module.locked = true;
    }

    return (
        <>
            <Card sx={{
                width: 260,
                height: 190,
                backgroundColor: 'secondary.main',
                borderRadius: '12px',
                boxShadow: '5px 5px 0px 5px rgba(0, 0, 0, 0.1)',
                ':hover': !module.locked && { backgroundColor: 'secondary.main', opacity: 0.8 }
            }}
            >

                <Link
                    to={{
                        pathname: question.type === 'codep' && !module.locked ? "/student/workenv" : question.type === 'multi' && !module.locked ? "/student/multiopt" : ""
                    }}
                    state={{ questionParams: question, homeworkParams: { id: module.id, group: params.group, course: params.course } }} //cambiar a hw_id? ass
                    style={{ textDecoration: 'none' }}
                >

                    <CardActionArea
                        disabled={module.locked ? true : false}
                    >

                        <Grid container
                            justifyContent="flex-end"
                            alignContent="flex-end"
                            sx={[
                                {
                                    backgroundColor: `${colors[color]}`, height: 35
                                },
                                module.locked && {
                                    backgroundColor: "#6D7483", height: 35
                                }
                            ]}
                        >
                            <Grid item sx={{ mr: 1 }}>
                                {/* <Typography fontSize={ 12 } sx={{ color: 'appDark.text' }} >Bloqueado el: { module.closeDate }</Typography> */}
                            </Grid>
                        </Grid>


                        <CardContent sx={{ textAlign: "center" }}>


                            {/* Si el usuario es estudiante, se muestra lo sigiente */}
                            <Grid container justifyContent='flex-end'>
                                <LockOutlined sx={[
                                    { color: 'secondary.main' },
                                    module.locked && { color: 'appDark.icon' }
                                ]} />
                            </Grid>

                            <Typography sx={{ color: 'appDark.text', fontSize: 26, fontWeight: 405, mt: 2 }} >
                                {module.name}
                            </Typography>

                            {/* Aqui va la barra con el progreso en caso de se un usuario alumno */}
                            <Grid container
                                sx={{ mt: 3 }}
                            >
                                <Grid item xs={10}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={module.progress}
                                        sx={{
                                            mt: 1,
                                            height: 10,
                                            borderRadius: 5,
                                            [`&.${linearProgressClasses.colorPrimary}`]: {
                                                backgroundColor: 'appDark.progressBg',
                                            },
                                            [`& .${linearProgressClasses.bar}`]: {
                                                borderRadius: 5,
                                                backgroundColor: 'appDark.progressBar',
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <Typography sx={{ color: 'appDark.text' }}>
                                        {module.progress}%
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </Card>
        </>
    )
}
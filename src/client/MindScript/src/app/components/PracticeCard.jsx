import { Card, CardContent, CardActionArea, Typography, Grid, IconButton, LinearProgress } from '@mui/material'
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { LockOutlined } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { Link, useParams } from 'react-router-dom';

export const PracticeCard = ({ module, index }) => {

    const riddleAPI = `http://localhost:8003/`

    const colors = ["#C12C45", "#5EC1F3", "#55D16E", "#FACD34"]
    const color = index - (colors.length * parseInt(index / colors.length));

    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid, responseInfo, path;

    if (user !== null) {
        //Desestructuración de user
        ({ email, displayName, emailVerified, uid } = user);
        //Matrícula A00000000
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Matrícula ", schoolID)
    }
    let params = useParams()


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
                const response = await fetch(`${riddleAPI}freemodequestion/${module.id}`, options);
                const responseData = await response.json();
                setQuestion(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);
    console.log(question)

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
                        pathname: question.type === 'codep' ? "/student/workenv" : question.type === 'multi' ? "/student/multiopt" : ""
                    }}
                    state={{ questionParams: question, homeworkParams: { fm_id: module.id, course: params.course } }}
                    style={{ textDecoration: 'none' }}
                >

                    <CardActionArea>

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
                        />


                        <CardContent sx={{ textAlign: "center", height: 155 }}>

                            <Typography sx={{ color: 'appDark.text', fontSize: 26, fontWeight: 405, mt: 5 }} >
                                {module.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </Card>
        </>
    )
}
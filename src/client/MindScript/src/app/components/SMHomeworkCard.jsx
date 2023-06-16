import { Card, Collapse, List, ListItem, ListItemButton, ListItemText, Typography, Grid, useTheme } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";


export const SMHomeworkCard = ({ data, index }) => {
    const riddleAPI = `http://localhost:8003/`
    const auth = getAuth();
    const theme = useTheme();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid, responseInfo, path;

    if (user !== null) {
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Matrícula ", schoolID)
    }

    //Array de los dias de la semana
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

    //Variables para sacar el dia de la entrega
    const d = new Date();
    let day = d.getDay();
    var today = day + index;

    if (today > 6) {
        today = today - 7;
    }


    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const hwIds = [];
    if (Array.isArray(data) && data.length > 0) {
        data.forEach((hwData) => {
            if (hwData.hasOwnProperty('hw_id')) {
                hwIds.push(hwData.hw_id);
            }
        });
    }

    const [question, setQuestion] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = () => {
            try {
                if (hwIds.length > 0) {
                    hwIds.forEach(async (id) => {
                        const response = await fetch(`${riddleAPI}questions?id_assigment=${id}&id_student=${schoolID}`, options);
                        const responseData = await response.json();
                        setQuestion(responseData);
                    })
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    return (

        <Card
            sx={[
                { borderRadius: '0px', boxShadow: 'none', mb: 2, width: 350 },
                open && {
                    borderRadius: '12px',
                }
            ]}
        >
            <ListItemButton
                onClick={handleClick}
                sx={[
                    {
                        backgroundColor: 'secondary.main',
                        ':hover': { backgroundColor: 'secondary.main', opacity: 0.9 }
                    },
                    open && {
                        backgroundColor: '#62569D',
                        ':hover': { backgroundColor: '#62569D', opacity: 0.9 }
                    }
                ]}
            >
                {open ? <ExpandLess sx={{ color: 'appDark.icon' }} /> : <ExpandMore sx={{ color: 'appDark.icon' }} />}
                <ListItemText sx={{ color: 'appDark.text' }} primary={days[today]} />
                <Grid sx={{ borderRadius: '20px', border: 2, borderColor: 'appDark.icon' }}>
                    <Typography sx={{ color: 'appDark.icon', fontWeight: 'bold', my: .1, mx: 1.1 }}>{data.length}</Typography>
                </Grid>

            </ListItemButton>

            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
            >
                <List
                    component="div"
                    disablePadding
                >

                    {data.map((homework, indexH) => (
                        <Grid container key={indexH}>
                            {/* {console.log(homework)} */}
                            <ListItem disablePadding>

                                {homework.done < homework.needed
                                    ? <Link
                                        to={{
                                            pathname: question.type === 'codep' ? "/student/workenv" : question.type === 'multi' ? "/student/multiopt" : ""
                                        }}
                                        state={{ questionParams: question, homeworkParams: homework }}
                                        style={{ textDecoration: 'none', color: theme.palette.appDark.textBlack }}
                                    >
                                        <ListItemButton>
                                            <ListItemText sx={{ pl: 4 }} primary={homework.hw_name} />

                                        </ListItemButton>
                                    </Link>

                                    : <ListItemButton disabled={true}>
                                        <ListItemText sx={{ pl: 4 }} primary={homework.hw_name} />
                                        < CheckCircleOutlineRoundedIcon sx={{ width: 20, color: "success.main" }} />
                                    </ListItemButton>}

                            </ListItem>
                        </Grid>

                    ))}

                </List>
            </Collapse>
        </Card>
    )
}
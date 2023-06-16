// --------------------------------------------------------------------
// ** file="SModulesPage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { Grid, Typography, List, IconButton, Button } from '@mui/material'
import { Card, CardContent, CardActionArea } from '@mui/material'
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";

// MindScript Components
import { PracticeCard, PracticeMCard} from '../../components';
import { FreeModeLayout } from '../../layout';

// ------------ ## End Imports region ------------


export const FreeMode = () => {
    // Initial States and Variables 
    const batmanAPI = `http://localhost:8002/`
    const home = '/student/home' //remove?
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

    //Current user data
    const auth = getAuth();
    const user = auth.currentUser;
    var schoolID;
    if (user !== null) {
        const { email, displayName, emailVerified, uid } = user
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Student modules user info", user)
        // console.log("Matrícula ", schoolID)
    }

    // ------------ # API region ------------

    //GET course information
    const [coursesData, setCourseRequest] = useState([]);
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
                const response = await fetch(`${batmanAPI}courses`, options);
                const responseData = await response.json();
                setCourseRequest(responseData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <FreeModeLayout backPage={"Grupos"} backURL={home}>
            {/* Displaying modules cards */}
            {coursesData.map((course, index) => (
                <Grid item key={index} xs={12} md={3.5} lg={4} xl={3} >
                    <PracticeMCard course={course} index={index} />
                </Grid>
            ))}
        </FreeModeLayout>
    )
}
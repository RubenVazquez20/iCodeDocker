// --------------------------------------------------------------------
// ** file="SModulesPage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";

// MindScript Components
import { ModulesLayout } from "../../layout";
import { SModuleCard } from '../../components';

// ------------ ## End Imports region ------------

export const SModulesPage = () => {

    // Initial States and Variables 
    const batmanAPI = `http://localhost:8002/`
    let params = useParams()
    const home = '/student/home' //remove?
    const groupName = (params.course + ' (Gpo. ID ' + params.group + ')') //El nombren se debe de sacar desde la pagina home
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]
    // console.log(useParams().group)

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

    //GET - Endpoint for obtaining module card data 
    const [modulesData, setModule] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const group = params.group;

        const fetchData = async () => {
            try {
                const response = await fetch(`${batmanAPI}groupmodules/${group}?user_id=${schoolID}`, options);
                const responseData = await response.json();
                setModule(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [modulesData]);

    //GET - Entopoint for obtaining homework data for the week
    const [homeworkData, setHomework] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }
        const group = params.group;

        const fetchData = async () => {
            try {
                const response = await fetch(`${batmanAPI}homework?id=${schoolID}&time=week&group=${group}&group_by=week`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, [homeworkData]);

    return (
        <ModulesLayout home={home} homeworkData={homeworkData} student={true} hwBTitle={'Asignaciones Faltantes'} groupName={groupName} pages={pages}>
            <Grid container columnSpacing={40} rowSpacing={5}>
                {/* Displaying modules cards */}
                {modulesData != null && modulesData != undefined ?
                    modulesData.map((module, index) => (
                        <Grid item key={index} xs={12} md={4} align='center'>
                            {module.progress === 100 && module !== modulesData[modulesData.length - 1] ? (
                                modulesData[index + 1].progress < 100 ? (
                                    modulesData[index + 1].locked = false
                                ) : null
                            ) : null}
                            <SModuleCard module={module} index={index} />
                        </Grid>
                    ))
                    : null}
            </Grid>
        </ModulesLayout>
    )
}


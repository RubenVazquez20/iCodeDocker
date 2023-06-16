// --------------------------------------------------------------------
// ** file="SModulesPage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { Grid, Typography, List, IconButton, Button } from '@mui/material'
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";

// MindScript Components
import { PracticeCard, NavBar } from '../components';

// ------------ ## End Imports region ------------

export const FreeModeLayout = ({ children, backPage, backURL }) => {
    // Initial States and Variables
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

    return (
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" padding={5} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />

            <Grid item xs={12} sx={{ mt: 4, height: '24px' }}>
                <Button href={backURL} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 16 }}>
                    {'< ' + backPage}
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={900} fontSize={18} sx={{ color: 'appDark.text' }}>
                    Modo de Practica
                </Typography>
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
                
                <Grid container direction="row" columnSpacing={20} rowSpacing={5}>
                    { children }
                </Grid>

            </Grid>

        </Grid>
    )
}
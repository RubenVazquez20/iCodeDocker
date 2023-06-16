// --------------------------------------------------------------------
// ** file="SProfile.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import React from 'react'

// MindScript Components
import { ProfileLayout } from '../../layout'

// ------------ ## End Imports region ------------

export const SProfile = () => {

    // Initial States and Variables 
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]
    return (
        <ProfileLayout pages={pages}>
        </ProfileLayout>
    )
}

import React from 'react'
import { ProfileLayout } from '../../layout'

export const PProfile = () => {
    const pages = [
        { name: 'Home', route: '/professor/home' },
        { name: 'Profile', route: '/professor/profile' },
    ]
    return (
        <ProfileLayout pages={pages}>
            
        </ProfileLayout>
    )
}

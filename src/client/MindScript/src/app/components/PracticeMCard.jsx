import { Card, CardContent, CardActionArea, Typography, Grid } from '@mui/material'
import * as React from 'react';

export const PracticeMCard = ({ course, index }) => {
    const colors = [ "#5EC1F3", "#55D16E", "#FACD34", "#C12C45" ]
    const color = index - (colors.length * parseInt(index / colors.length));

    // console.log("la info si se paso",course)

    return (
        <Card sx={{
            width: 300,
            height:246.5,
            backgroundColor: 'secondary.main',
            borderRadius: '12px',
            boxShadow: '5px 5px 0px 5px rgba(0, 0, 0, 0.1)',
            ':hover': { backgroundColor: 'secondary.main', opacity: 0.8 } }}
        >
            <CardActionArea href={ "freemode/"+course.id } >
                <Grid sx={{ backgroundColor: `${colors[color]}`, height: 40 }} />
                <CardContent sx={{ pt: 4, pb: 6, height: 208 }}>
                    <Typography  xs={6} sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 405, mt: 4 }} >
                        { course.id }. { course.name }
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
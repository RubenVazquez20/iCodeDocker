import { Grid, Modal, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import { React } from 'react';


export const Confirmation = ({ open, close, id, confirmationText, handleFunction, confirmationTextButton }) => {
    const theme = useTheme();

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerWidth = isLargeScreen ? '30vw' : isMediumScreen ? '50vw' : '80vw';

    const handleButtonClick = async () => {
        const response = await handleFunction(id);
        if (response && response.ok) {
            close();
        }
    };

    return (
        <Modal
            open={open}
            onClose={close}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                justifyContent='center'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 10,
                    width: containerWidth,
                }}>

                <Grid item xs={12}>

                    <Typography id="modal-hw-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        {confirmationText}
                    </Typography>

                </Grid>

                {/* Botones */}
                <Grid container sx={{ my: 3, mx: 5.5 }}>
                    <Grid item xs={6} align='center'>
                        <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                            Cancelar
                        </Button>

                    </Grid>

                    <Grid item xs={6} align='center'>
                        <Button
                            onClick={handleButtonClick}
                            type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                            {confirmationTextButton}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Modal >
    )
}
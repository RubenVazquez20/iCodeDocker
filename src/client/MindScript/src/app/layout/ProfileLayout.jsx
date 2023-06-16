import React, { useState, useEffect } from 'react';
import { Grid, Typography, useTheme, Fade } from '@mui/material';
import { NavBar } from '../components';
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

export const ProfileLayout = ({ children, pages }) => {
  const theme = useTheme();
  const auth = getAuth();
  const user = auth.currentUser;
  let schoolID, email, displayName, emailVerified, uid;
  if (user !== null) {
    ({ email, displayName, emailVerified, uid } = user);
    schoolID = (user.email).substring(0, 9).toUpperCase();
  }
  const { route } = pages.find(route => route.name === "Home");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/1.svg',
    '/2.svg',
    '/3.svg',
    '/4.svg',
    '/5.svg',
    '/6.svg',
  ];

  useEffect(() => {
    if (currentImageIndex < images.length - 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => prevIndex + 1);
      }, 150); // Change the time interval (in milliseconds) as per your preference

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentImageIndex, images.length]);

  const isLastImage = currentImageIndex === images.length - 1;
  const [showWelcome, setWelcome] = useState(false);

  useEffect(() => {
    if (isLastImage) {
      const delay = setTimeout(() => {
        setWelcome(true);
      }, 300); // Change the delay time (in milliseconds) as per your preference

      return () => {
        clearTimeout(delay);
      };
    }
  }, [isLastImage]);

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      alignContent='center'
      spacing={0}
      sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}
    >
      <NavBar pages={pages} />

      <Grid item>
        <Fade in={true}>
          <img
            src={images[currentImageIndex]}
            alt="Transition Image"
            style={{
              width: '480px',
            }}
          />
        </Fade>
      </Grid>

      <Grid item xs={12} align='center'>
        <Fade in={showWelcome}>
          <Typography sx={{ color: 'appDark.text', fontSize: 50 }}>
            ¡Bienvenido(a), {displayName}!
          </Typography>
        </Fade>
      </Grid>

      <Grid item xs={12} align='center'>
        <Fade in={showWelcome}>
          <Typography sx={{ color: 'appDark.text', fontSize: 20 }}>
            Comienza a descubrir todo lo que el aprendizaje computacional tiene reservado para ti
          </Typography>
        </Fade>
      </Grid>

      <Grid item xs={12} align='center' sx={{ mt: 2 }}>
        <Fade in={showWelcome}>
          <Link to={route} style={{ color: theme.palette.appDark.text }}>
            Comenzar
          </Link>
        </Fade>
      </Grid>
    </Grid>
  );
};


// --------------------------------------------------------------------
// ** file="RegistePage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region ------------
import React from "react";

// Core components from MUI
import { useMemo, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Typography,
  Select,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

// MindScript Components
import { useForm } from "../../hooks/useForm";
import { AuthLayout } from "../layout/AuthLayout";
import { startCreatingUserWithEmailPassword } from "../../store/auth";

// ------------ ## End Imports region ------------

export const RegisterPage = () => {

  // Initial States and Variables
  const batmanAPI = `http://localhost:8002/`
  const dispatch = useDispatch();

  //Toogle show password content
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //Campus Selector states
  const [campusList, setCampusList] = useState([]);
  const [selectedCampus, setCampus] = useState("");
  const handleCampusSelection = (event) => {
    setCampus(event.target.value);
  };

  /*----------- AUTH region ------*/

  //formData es el objeto que estamos esperando (se rellena con los inputs)
  const formData = {
    displayName: "",
    firstLastName: "",
    secondLastName: "",
    id: "",
    email: "",
    campus: "",
    password: "",
    confirmation: "",
  };
  const formValidations = {
    /*personalizado del tutorial, hay herramientas externas para hacer validaciones
    //son arreglos, 1 param es el valor que ingresa el user, el segundo es el mensaje de error por si no se cumple la validacion, se las vamos a pasar a la función de useForm
    //si una de estas no se cumple el formulario no va a ser válido*/
    id: [
      (value) => value.includes("A0") || value.includes("L0") || value.includes("S0"),
      "Ingresa tu matrícula o nómina",
    ], //deben ser los mismos nombres del objeto del formulario
    email: [
      (value) => (value.includes("@tec.mx") && value.includes(id)),
      "Debes entrar con tu correo institucional",
    ], //deben ser los mismos nombres del objeto del formulario
    password: [
      (value) => value.length >= 6,
      "El password debe de tener al menos 6 caracteres",
    ],
    confirmation: [
      (value) => value === password,
      "Tu confirmación es diferente a tu contraseña",
    ],
    displayName: [(value) => value.length >= 1, "Tu nombre es requerido"],
    // campus: [(value) => value === selectedCampus, 'Ingresa las 3 primeras letras de tu campus en mayúscula'],
    // firstLastName: [(value) => value.length >= 2, 'Error del primer apellido'],
  };

  /*El estado formSubmitted impide que las validaciones/errores se muestren antes de hacer click en Submit */
  const [formSubmitted, setFormSubmitted] = useState(false);

  /*Este es el estatus de la autenticación y los mensajes de error de Firebase */
  const { status, errorMessage } = useSelector((state) => state.auth);

  //Para que no puedan dar submit mientras esta en estado checking se bloquean los botones
  const isCheckingAuthentication = useMemo(
    () => status === "checking",
    [status]
  );

  const {
    /*Campos del registro*/
    displayName,
    firstLastName,
    secondLastName,
    id,
    email,
    campus,
    password,
    confirmation,
    /*Funciones que trackean el estadio (cambio en input)*/
    onInputChange,
    formState,
    isFormValid,
    /*Variables que tienen el error de validación*/
    displayNameValid,
    firstLastNameValid,
    secondLastNameValid,
    idValid,
    emailValid,
    campusValid,
    passwordValid,
    confirmationValid,
  } = useForm(formData, formValidations);

  /*----------- ## End AUTH region ------*/

  // ------------ # API region ------------

  //GET - Campus list
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`${batmanAPI}campus`, options);
        const responseData = await response.json();
        setCampusList(responseData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  //Registration request to DB endopoint
  const registrationRequest = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        id: formState.id,
        campus: selectedCampus,
        name: formState.displayName,
        flast_name: formState.firstLastName,
        slast_name: formState.secondLastName,
      }),
    };
    console.log(options);
    fetch(`${batmanAPI}registeruser`, options)
      .then((response) => {
        // console.log("createHomeworkRequest", response)
        if (response.status === 201) {
          // console.log(respose)
          throw new Error("Usuario creado");
        }

        console.log(respose);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* ------------ ## End API region ------------*/

  // ------------ # Functions and Events region ------------

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startCreatingUserWithEmailPassword(formState));
    // console.log(formState); //formState nos trae el objeto con los valores rellenos
    registrationRequest();
  };

  return (
    <AuthLayout title="Registro">
      <form onSubmit={onSubmit}>
        <Grid container justifyContent="center">
          {/* Name*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Nombre
              </InputLabel>
              <OutlinedInput
                required
                type="text"
                label="Nombre"
                placeholder="Ej. Daniel"
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
                //Validation
                name="displayName"
                value={displayName}
                onChange={onInputChange}
                error={!!displayNameValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{displayNameValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* First Lastname*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Apellido Paterno
              </InputLabel>
              <OutlinedInput
                required
                type="text"
                label="FirstLastName"
                placeholder="Ej. González"
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
                //Validation
                name="firstLastName"
                value={firstLastName}
                onChange={onInputChange}
                error={!!firstLastNameValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{firstLastNameValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* Second Lastname*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Apellido Materno
              </InputLabel>
              <OutlinedInput
                required
                type="text"
                label="SecondLastName"
                placeholder="Ej. Perez"
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
                //Validation
                name="secondLastName"
                value={secondLastName}
                onChange={onInputChange}
              //Error managing
              // error={prueba != 12}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{secondLastNameValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* ID*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                // required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Matrícula/Nómina
              </InputLabel>
              <OutlinedInput
                required
                type="text"
                label="Matrícula/Nómina"
                placeholder="A000000000/L00000000"
                //Validation
                name="id"
                value={id} //A0XXXX
                onChange={onInputChange}
                error={!!idValid && formSubmitted}
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{idValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* Correo*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Correo
              </InputLabel>
              <OutlinedInput
                required
                type="email"
                label="Correo"
                placeholder="A000000000@tec.mx"
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
                //Validation
                name="email"
                value={email}
                onChange={onInputChange}
                error={!!emailValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{emailValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* Campus selector */}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                id="campusSelectorInputLabel"
                sx={{
                  color: "appDark.text",
                  "&:hover": {
                    color: "appDark.text", //change label color
                  },
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Campus
              </InputLabel>

              <Select
                required
                id="campusSelector"
                value={selectedCampus}
                onChange={handleCampusSelection}
                sx={{
                  borderRadius: 2,
                  bgcolor: "appDark.bgBox",
                  color: "appDark.text",
                  svg: { color: "appDark.text" },
                  "&.Mui-focused .MuiSelect-outlined": {
                    borderColor: "error", //change label color
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "appDark.bgBox",
                    },
                  },
                }}
              >
                {campusList.map((campus) => (
                  <MenuItem
                    sx={{
                      color: "appDark.text",
                      bgcolor: "appDark.bgBox",
                      "&:hover": {
                        bgcolor: "appDark.selectHover", //change label color
                      },
                    }}
                    key={campus.campus_id}
                    value={campus.campus_id}
                  >
                    {campus.campus_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{campusValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* Contraseña*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Contraseña
              </InputLabel>
              <OutlinedInput
                required
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: "appDark.icon" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
                placeholder="****"
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
                //Validation
                name="password"
                value={password}
                onChange={onInputChange}
                error={!!passwordValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{passwordValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* Confirmar Contraseña*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl
              fullWidth
              sx={{ backgroundColor: "appDark.bgBox", borderRadius: 1 }}
            >
              <InputLabel
                required
                sx={{
                  color: "appDark.text",
                  "&.Mui-focused": {
                    color: "appDark.text", //change label color
                  },
                }}
              >
                Confirmar contraseña
              </InputLabel>
              <OutlinedInput
                required
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: "appDark.icon" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirmar contraseña"
                placeholder="****"
                sx={{
                  color: "appDark.text",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "appDark.box", //change border color when focused
                  },
                }}
                //Validation
                name="confirmation"
                value={confirmation}
                onChange={onInputChange}
                error={!!confirmationValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: "transparent", ml: 1 }}>
              {formSubmitted && (
                <FormHelperText error>{confirmationValid}</FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent="end" sx={{ mt: 1 }}>
            <Typography sx={{ color: "appDark.text", mr: 1 }}>
              ¿Ya tienes cuenta?{" "}
            </Typography>
            <Link
              component={RouterLink}
              to="/auth/login"
              sx={{ color: "appDark.link", textDecoration: "underline" }}
            >
              Ingresar
            </Link>
          </Grid>

          <Grid
            item
            xs={12}
            // la doble negación lo convierte en un valor bool
            display={!!errorMessage ? "" : "none"}
          >
            <Alert severity="error">{errorMessage}</Alert>
          </Grid>

          <Grid
            container
            direction="column"
            alignContent="center"
            sx={{ mt: 1 }}
          >
            <Grid item>
              <Button
                disabled={isCheckingAuthentication}
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "appDark.button" }}
              >
                Regístrate
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

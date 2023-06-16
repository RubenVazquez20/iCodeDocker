import { Grid } from "@mui/material";

import React from "react";

export const AuthLayout = ({ children, title = "" }) => {

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh', backgroundColor: 'primary.main' }}>

      <Grid item>
        <img src="/MindScript.svg" width="480" />
      </Grid>

      <Grid
        item
        className="box-shadow"
        xs={12}
        sx={{ width: '50vw', backgroundColor: 'secondary.main', padding: 3, borderRadius: 2 }}>
        {children}

      </Grid>

    </Grid>
  )
}
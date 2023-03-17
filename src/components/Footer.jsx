import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function Footer() {
  return (
    <Paper sx={{backgroundColor: "red", marginTop: 'calc(10% + 60px)', bottom: 0}} component="footer" square variant="outlined">
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            my:2,
            mb: 4
          }}
        >
          <Box sx={{display: "flex", alignItems: "center", mt: 2}}>
            <Typography color="white" variant="h4" sx={{
            ml: 2}}>Messengers of Lahar</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            mb: 2,
          }}
        >
          <Typography variant="caption" color="white">
            Copyright ©2022. Patty Otero oteropatty@gmail.com
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}
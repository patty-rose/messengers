import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          margin: 0,
          padding: 0,
        },
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
  palette: {
    primary: {
      light: red[50],
      main: red[600],
      dark: red[900],
    },
  },
  typography: {
    fontFamily: `'La Belle Aurore', cursive`,
    h1: {
      fontFamily: `'La Belle Aurore', cursive`,
      fontWeight: 600,
    },
    h4: {
      fontFamily: `'La Belle Aurore', cursive`,
      fontWeight: 500,
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;

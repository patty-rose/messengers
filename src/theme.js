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
    fontFamily: `"Times New Roman", Times, serif`,
    h1: {
      fontFamily: `"Times New Roman", Times, serif`,
      fontWeight: 600,
    },
    h4: {
      fontFamily: `"Times New Roman", Times, serif`,
      fontWeight: 500,
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;

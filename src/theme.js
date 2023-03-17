import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
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

export default theme;

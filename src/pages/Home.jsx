import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import homeBackground from "../img/homeBackground.jpg";
import candle from "../img/candle.png";
import hand from "../img/hand.png";

const Home = (props) => {
  const { listOfPages, onGetRandomPageId } = props;
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const randomPageId = onGetRandomPageId(listOfPages);

  const handleNavigationClick = () => {
    navigate(`/mol/${randomPageId}`);
  };

  //preload all images:
  useEffect(() => {
    listOfPages.forEach((page) => {
      const img = new Image();
      img.src = page.backgroundImage;
      img.style.display = "none";
      document.getElementById("hidden-container").appendChild(img);
    });
  }, [listOfPages]);

  const molPageStyle = {
    backgroundImage: `url('${homeBackground}')`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...molPageStyle,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: "33vh", marginLeft: "10vh", marginRight: "10vh" }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: `Special Elite`,
            fontWeight: "bold",
            textAlign: "center",
            color: "red",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            marginBottom: "10vh",
          }}
        >
          Messengers of Lahar
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: `Special Elite`,
            color: "red",
            textAlign: "center",
            fontWeight: "bold",
            letterSpacing: "0.08em",
          }}
        >
          Live your desires and reverse the shame thrust on you by those fearful
          of exploration
        </Typography>
      </Stack>
      <Box
        component="img"
        sx={{
          height: "25%",
          position: "fixed",
          bottom: 0,
          left: "15%",
          transition: "transform 0.3s, filter 0.3s",
          cursor: "help",
          "&:hover": {
            transform: "scale(1.01)",
            filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.5))",
          },
        }}
        alt="a black and white hand, palm facing viewer, holding up thumb, index, and middle finger, with pinky and ring tucked and pressing on palm."
        src={hand}
        onClick={() => {
          handleNavigationClick();
        }}
      />

      <Box
        sx={{
          position: "fixed",
          top: isMobile ? "1rem" : "auto",
          bottom: isMobile ? "auto" : "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "white",
          fontSize: isMobile ? "1rem" : "2rem",
          fontWeight: "bold",
          px: isMobile ? 2 : 0,
          zIndex: 10,
          maxWidth: isMobile ? "90vw" : "auto",
          overflowWrap: "break-word",
          pointerEvents: "auto", // so it remains clickable
        }}
      >
        <a
          href="mailto:messengersoflahar@zohomail.com"
          style={{
            fontFamily: `Special Elite`,
            color: "white",
            textDecoration: "none",
            display: "inline-block",
            width: "100%",
          }}
        >
          messengersoflahar@zohomail.com
        </a>
      </Box>

      <Box
        component="img"
        sx={{
          height: "25%",
          position: "fixed",
          bottom: 0,
          right: "15%",
          transition: "transform 0.3s, filter 0.3s",
          cursor: "help",
          "&:hover": {
            transform: "scale(1.01)",
            filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.5))",
          },
        }}
        alt="a black and white lit candle"
        src={candle}
        onClick={() => {
          handleNavigationClick();
        }}
      />
      <div id="hidden-container"></div>
      <Box
        sx={{
          position: "fixed",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      ></Box>
    </Box>
  );
};

Home.propTypes = {
  listOfPages: PropTypes.array,
  onGetRandomPageId: PropTypes.func,
};

export default Home;

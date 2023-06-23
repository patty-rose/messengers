import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import candle from "../img/candle.png";
import hand from "../img/hand.png";

const MolPage = (props) => {
  const { onGetRandomPageId } = props;
  const { pageId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");

  //retrieve page list from local storage
  const jsonStoredPages = localStorage.getItem("mainPageList");
  const listOfPages = JSON.parse(jsonStoredPages);
  const thisPage = listOfPages?.find((page) => page.id === pageId);
  const randomPageId = onGetRandomPageId(listOfPages, pageId);
  useEffect(()=>{
    if (!listOfPages){
      navigate(`/`);
    }
  }, [])

  const handleNavigationClick = () => {
    navigate(`/mol/${randomPageId}`);
  };

  const molPageStyle = {
    backgroundImage: `url('${thisPage?.backgroundImage}')`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "black",
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        ...molPageStyle,
      }}
    >
      <Stack direction="column" alignItems="center">
        <Typography
          variant="h3"
          sx={{
            color: "red",
            // textShadow: "0px 0px 2px rgba(255, 255, 255, 1)",
            // // filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.5))",
            marginLeft: isMobile ? "5vh" : "10vh",
            marginRight: isMobile ? "5vh" : "10vh",
            marginTop: thisPage.textPosition ? `${thisPage.textPosition}vh` : "47vh",
            fontSize: isMobile ? "7vw" : undefined,
            fontWeight: "bold",
            letterSpacing: "0.01em",
          }}
        >
          {thisPage?.pageText}
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
            filter: "drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.5))",
          },
        }}
        alt="a black and white lit candle"
        src={candle}
        onClick={() => {
          handleNavigationClick();
        }}
      />
    </Box>
  );
};

MolPage.propTypes = {
  listOfPages: PropTypes.array,
  onGetRandomPageId: PropTypes.func,
};

export default MolPage;

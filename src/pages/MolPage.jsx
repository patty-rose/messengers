import React from "react";
import PropTypes from "prop-types";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { red } from "@mui/material/colors";
import candle from "../img/candle.png";
import hand from "../img/hand.png";

const MolPage = (props) => {
  const { listOfPages, onGetRandomPageId } = props;
  const { pageId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)');

  const thisPage = listOfPages.find((page) => page.id === pageId);

  const randomPageId = onGetRandomPageId(listOfPages);

  const handleNavigationClick = () => {
    navigate(`/${randomPageId}`);
  };

  const molPageStyle = {
    backgroundImage: `url('${thisPage.backgroundImage}')`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
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
        spacing={8}
        alignItems="center"
      >
        <Typography
          variant='h3'
          sx={{
            color: "red",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            marginLeft: isMobile ? '5vh' : "10vh",
            marginRight: isMobile ? '5vh' : "10vh",
            marginBottom: isMobile ? '70vh' : '0',
            fontSize: isMobile ? '7vw' : undefined
          }}
        >
          {thisPage.pageText}
        </Typography>
      </Stack>

      <Box
        component="img"
        sx={{
          height: "30%",
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
          height: "30%",
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
    </Box>
  );
};

MolPage.propTypes = {
  listOfPages: PropTypes.array,
  onGetRandomPageId: PropTypes.func,
};

export default MolPage;

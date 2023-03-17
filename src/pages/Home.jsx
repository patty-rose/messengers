import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import {useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import homeBackground from "../img/homeBackground.jpg";
import candle from "../img/candle.png";
import hand from "../img/hand.png";

const Home = (props) => {
  const { listOfPages, onGetRandomPageId } = props;
  const navigate = useNavigate();

  const randomPageId = onGetRandomPageId(listOfPages);

  const handleNavigationClick = () => {
    navigate(`/${randomPageId}`);
    console.log("trying to navigate", randomPageId);
  };

  const molPageStyle = {
    backgroundImage: `url('${homeBackground}')`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center",         justifyContent: "center",  ...molPageStyle }}>
      <Stack
        direction="column"
        spacing={8}
        alignItems="center"
      >
        <Typography variant="h1" color="primary">
          Messengers of Lahar
        </Typography>
        <Typography variant="h4" color="primary">
          Live your desires and reverse the shame thrust on you by those fearful
          of exploration
        </Typography>
      </Stack>

      <Box
        component="img"
        sx={{
          height: "30%",
          position: "fixed",
          bottom: 0,
          left: "15%",
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

Home.propTypes = {
  listOfPages: PropTypes.array,
  onGetRandomPageId: PropTypes.func,
};

export default Home;

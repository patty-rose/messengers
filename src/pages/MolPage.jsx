import React from "react";
import PropTypes from "prop-types";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import candle from "../img/candle.png";
import hand from "../img/hand.png";

const MolPage = (props) => {
  const { listOfPages, onGetRandomPageId } = props;
  const { pageId } = useParams();
  const navigate = useNavigate();

  const thisPage = listOfPages.find((page) => page.id === pageId);

  const randomPageId = onGetRandomPageId(listOfPages);

  const handleNavigationClick = () => {
    navigate(`/${randomPageId}`)
    console.log("trying to navigate", randomPageId);
  }

  const molPageStyle = {
    backgroundImage: `url('${thisPage.backgroundImage}')`,
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
        <Typography variant="h4" color="primary">
          {thisPage.pageText}
        </Typography>
      </Stack>

      <Box
        component="img"
        sx={{
          height: "30%",
          position: "fixed",
          bottom: 0,
          left: "15%"
        }}
        alt="a black and white hand, palm facing viewer, holding up thumb, index, and middle finger, with pinky and ring tucked and pressing on palm."
        src={hand}
        onClick= {()=>{handleNavigationClick()}}
      />

      <Box
        component="img"
        sx={{
          height: "30%",
          position: "fixed",
          bottom: 0,
          right: "15%"
        }}
        alt="a black and white lit candle"
        src={candle}
        onClick= {()=>{handleNavigationClick()}}
      />
    </Box>
  );
};

MolPage.propTypes = {
  listOfPages: PropTypes.array,
  onGetRandomPageId: PropTypes.func,
};

export default MolPage;

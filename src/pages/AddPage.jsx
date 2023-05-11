import React from "react";
import PropTypes from "prop-types";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

function AddPage(props) {
  const navigate = useNavigate();

  function handleAddPageSubmission(event) {
    event.preventDefault();
    props.onNewPageCreation({
      pageText: event.target.pageText.value,
      backgroundImage: event.target.backgroundImage.value,
      timeOpen: serverTimestamp(),
    });
    navigate("/admin/dashboard");
  }

  return (
    <React.Fragment>
      <form onSubmit={handleAddPageSubmission}>
        <TextField 
          label="text to display on page" 
          name="pageText"
          variant="outlined" />
        <TextField 
          label="Background Image URL" 
          name="backgroundImage"
          variant="outlined" />
        <button type="submit">Submit</button>
      </form>
    </React.Fragment>
  );
}

AddPage.propTypes = {
  onNewPageCreation: PropTypes.func,
};

export default AddPage;

import React from "react";
import PropTypes from "prop-types";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
        <input
          type="text"
          name="pageText"
          placeholder="text to display on page"
        />
        <input
          type="text"
          name="backgroundImage"
          placeholder="Background Image URL"
        />
        <button type="submit">Submit</button>
      </form>
    </React.Fragment>
  );
}

AddPage.propTypes = {
  onNewPageCreation: PropTypes.func,
};

export default AddPage;

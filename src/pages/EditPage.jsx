import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";

function EditPage(props) {
  const { listOfPages } = props;
  const { pageId } = useParams();
  const navigate = useNavigate();
  const thisPage = listOfPages.find((page) => page.id === pageId);
  const [formData, setFormData] = useState({
    pageText: thisPage.pageText,
    backgroundImage: thisPage.backgroundImage,
  });

  function handleEditPageSubmission(event) {
    event.preventDefault();
    props.onEditPage({
      pageText: event.target.pageText.value,
      backgroundImage: event.target.backgroundImage.value,
      id: thisPage.id,
    });
    navigate("/admin/dashboard");
  }

  return (
    <React.Fragment>
        <form onSubmit={handleEditPageSubmission}>
        <TextField 
          label="text to display on page" 
          name="pageText"
          variant="outlined"
          defaultValue={formData.pageText}
          onChange={(e) => {
            setFormData({ ...formData, pageText: e.target.value });
          }} />
        <TextField 
          label="Background Image URL" 
          name="backgroundImage"
          variant="outlined"
          defaultValue={formData.backgroundImage} 
          onChange={(e) => {
            setFormData({ ...formData, backgroundImage: e.target.value });
          }} />

        {/* <label>text to display on page</label>
        <input
          type='text'
          name='pageText'
          defaultValue={formData.pageText}
          onChange={(e) => {
            setFormData({ ...formData, pageText: e.target.value });
          }} />
        <label>Background Image URL</label>
        <input
          type='text'
          name='backgroundImage'
          defaultValue={formData.backgroundImage} 
          onChange={(e) => {
            setFormData({ ...formData, backgroundImage: e.target.value });
          }}/> */}
        <button type='submit'>Edit</button>
      </form>
    </React.Fragment>
  );
}

EditPage.propTypes = {
  listOfPages: PropTypes.array,
  onEditPage: PropTypes.func,
};

export default EditPage;

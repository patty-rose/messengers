import React, { useState } from "react";
import PropTypes from "prop-types";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function AddPage(props) {
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState();

  const uploadImage = async () => {
    if (imageUpload == null) return null;
    const imageRef = ref(storage, `/${imageUpload.name + v4()}`);

    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAddPageSubmission = async (event) => {
    event.preventDefault();
    const backgroundURL = await uploadImage();
    if (backgroundURL) {
      props.onNewPageCreation({
        pageText: event.target.pageText.value,
        textPosition: event.target.textPosition.value,
        backgroundImage: backgroundURL,
        timeOpen: serverTimestamp(),
      });
      navigate("/admin/dashboard");
    } else {
      // Handle case when image upload fails
      // Add appropriate error handling logic here
      console.error("Image upload failed.");
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleAddPageSubmission}>
        <TextField
          label="text to display on page"
          name="pageText"
          variant="outlined"
        />

        <TextField
          label="text position: 0-95 (top of page to bottom)"
          name="textPosition"
          variant="outlined"
          type="number"
          min="0"
          max="100"
          defaultValue="47"
        />

        <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
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

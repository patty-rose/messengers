import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Box, Typography } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

function PageForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    pageText: initialData.pageText || "",
    textPosition: initialData.textPosition || "47",
    backgroundImage: initialData.backgroundImage || "",
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [manualImageURL, setManualImageURL] = useState(
    initialData.backgroundImage || ""
  );

  const navigate = useNavigate();

  const handleFileUpload = async () => {
    // PRIORITY: Uploaded image wins over URL
    if (imageUpload) {
      const imageRefName = imageUpload.name + v4();
      const imageRef = ref(storage, `/${imageRefName}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      return { url, imageRefName };
    } else if (manualImageURL) {
      return {
        url: manualImageURL,
        imageRefName: "", // no Firebase reference for external URL
      };
    } else {
      return {
        url: "",
        imageRefName: "",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageData = await handleFileUpload();
      onSubmit({
        ...formData,
        backgroundImage: imageData.url,
        imageRefName: imageData.imageRefName,
      });
      navigate("/admin/dashboard");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        px: 2,
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="Text to display on page"
        name="pageText"
        margin="normal"
        variant="outlined"
        value={formData.pageText}
        onChange={(e) =>
          setFormData({ ...formData, pageText: e.target.value })
        }
        fullWidth
      />

      <TextField
        label="Text vertical position (0 = top, 95 = bottom)"
        name="textPosition"
        type="number"
        inputProps={{ min: 0, max: 95 }}
        margin="normal"
        variant="outlined"
        value={formData.textPosition}
        onChange={(e) =>
          setFormData({ ...formData, textPosition: e.target.value })
        }
        fullWidth
      />

      {(imageUpload || manualImageURL || formData.backgroundImage) && (
        <Box mt={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Image preview:
          </Typography>
          <img
            src={
              imageUpload
                ? URL.createObjectURL(imageUpload)
                : manualImageURL || formData.backgroundImage
            }
            alt="Selected background"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        </Box>
      )}

      <Typography variant="subtitle2">Upload an image:</Typography>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImageUpload(e.target.files[0]);
        }}
        style={{ marginBottom: "1rem" }}
      />

      <Typography variant="subtitle2">Or enter an image URL:</Typography>
      <TextField
        label="Image URL"
        value={manualImageURL}
        onChange={(e) => setManualImageURL(e.target.value)}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        {initialData.pageText ? "Save Changes" : "Create Page"}
      </Button>
    </Box>
  );
}

PageForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default PageForm;

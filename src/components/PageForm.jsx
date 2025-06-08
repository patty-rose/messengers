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
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!imageUpload) {
      return {
        url: formData.backgroundImage,
        imageRefName: initialData.imageRefName || "",
      };
    }

    const imageRefName = imageUpload.name + v4();
    const imageRef = ref(storage, `/${imageRefName}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(snapshot.ref);

    return { url, imageRefName };
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

      {formData.backgroundImage && (
        <Box mt={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Current background image:
          </Typography>
          <img
            src={formData.backgroundImage}
            alt="Existing background"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            An image already exists. You can upload a new one to replace it:
          </Typography>
        </Box>
      )}

      {!formData.backgroundImage && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Upload a background image:
        </Typography>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageUpload(e.target.files[0])}
        style={{ marginBottom: "1rem" }}
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

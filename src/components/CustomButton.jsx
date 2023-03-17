import { Button } from "@mui/material";
import React from "react";

const CustomButton = ({
  onClickFunction,
  buttonText
}) => {
  return( 
    <Button 
      onClick={onClickFunction} 
      sx={{
        backgroundColor: "#0F1B4C", 
        color: "#fff", 
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        padding: "0.5rem 1.25rem",
        borderRadius: "7px",
        textTransform: "none",
        display: "block",
        border: "2px solid transparent", "&:hover": {
          backgroundColor: "#fff",
          color:"#0F1B4C",
          borderColor: "#0F1B4C"
        }
      }}
    >
      {buttonText}
    </Button>
  )
};

export default CustomButton;
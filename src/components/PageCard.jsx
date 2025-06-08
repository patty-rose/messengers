import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import { Box } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export function PageCard(props) {
  const { fromDashboard, pageText, backgroundImage, imageRefName, id, handleClickingDelete } =
    props;
  return (
    <React.Fragment>
      <Card elevation={2} sx={{ xs: "flex", mt: 3 }}>
        <CardHeader
          title={pageText}
          action={
            <Box>
              <IconButton aria-label="view">
                <Link
                  state={{ fromDashboard: fromDashboard || false }}
                  style={{ textDecoration: "none", color: "#4F5361" }}
                  to={`/mol/${id}`}
                  className="btn"
                >
                  <PreviewIcon />
                </Link>
              </IconButton>
              <IconButton aria-label="edit">
                <Link
                  style={{ textDecoration: "none", color: "#4F5361" }}
                  to={`/admin/edit/${id}`}
                  className="btn"
                >
                  <EditIcon />
                </Link>
              </IconButton>
              <IconButton
                style={{ textDecoration: "none", color: "#4F5361" }}
                aria-label="delete"
                onClick={() => handleClickingDelete(id, imageRefName)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Box>
          }
        />
        {backgroundImage && (
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <img
              src={backgroundImage}
              alt="Page background"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
      </Card>
    </React.Fragment>
  );
}

PageCard.propTypes = {
  pageText: PropTypes.string,
  backgroundImage: PropTypes.string,
  imageRefName: PropTypes.string,
  id: PropTypes.string,
  handleClickingDelete: PropTypes.func,
  fromDashboard: PropTypes.bool,
};

export default PageCard;

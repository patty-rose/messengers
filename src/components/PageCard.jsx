import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import { Box } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export function PageCard(props) {
  const { pageText, backgroundImage, id, handleClickingDelete } =
    props;

  return (
    <React.Fragment>
      <Card elevation={2} sx={{ xs: "flex",  mt: 3 }}>
        <CardHeader
          action={
            <Box>
              <IconButton aria-label="view">
                <Link
                  style={{ textDecoration: "none", color: "#4F5361" }}
                  to={`/${id}`}
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
                    aria-label="edit"
                    onClick={() => {
                      handleClickingDelete(id);
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
            </Box>
          }
          title={pageText}
          subheader={backgroundImage}
        ></CardHeader>
      </Card>
    </React.Fragment>
  );
}

PageCard.propTypes = {
  pageText: PropTypes.string,
  backgroundImage: PropTypes.string,
  timestamp: PropTypes.object,
  id: PropTypes.string,
  handleClickingDelete: PropTypes.func
};

export default PageCard;

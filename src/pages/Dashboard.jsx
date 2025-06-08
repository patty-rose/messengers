import React from "react";
import { Link } from "react-router-dom";
import Page from "../components/PageCard";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Dashboard = (props) => {
  return (
    <React.Fragment>
      <Card elevation={0} sx={{ xs: "flex", m: 5 }}>
        <CardHeader
          action={
            <IconButton aria-label="add">
              <Link
                to="/admin/addPage"
                className="btn"
                style={{
                  textDecoration: "none",
                  color: "#4F5361",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px", // space between icon and text
                }}
              >
                <AddCircleIcon />
                <span style={{ fontSize: "0.9rem" }}>Add Page</span>
              </Link>
            </IconButton>
          }
          // subheader= {props.error ? error : "add, view, and edit your pages"}
        />

        <CardContent>
          <Grid
            container
            spacing={0}
            direction="column"
            alignSelf="center"
            justify="center"
            sx={{ minHeight: "100vh" }}
          >
            {props.listOfPages.map((page) => (
              <Page
                pageText={page.pageText}
                backgroundImage={page.backgroundImage}
                imageRefName={page.imageRefName}
                timestamp={page.timestamp}
                timeOpen={page.timeOpen}
                id={page.id}
                key={page.id}
                handleClickingDelete={props.onClickingDelete}
                fromDashboard={true}
              />
            ))}
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  listOfPages: PropTypes.array,
  onClickingDelete: PropTypes.func,
};
export default Dashboard;

import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Container } from "@mui/system";
import Button from "@mui/material/Button";
import { Drawer, List, ListItem, styled } from "@mui/material";

export const Navbar = (props) => {
  const [pages, setPages] = useState([]);
  const [toggleIcon, setToggleIcon] = useState(null);
  const [accountButton, setAccountButton] = useState([]);
  const [mobileMenu, setMobileMenu] = useState({ left: false });
  const navigate = useNavigate();
  const { currentUser } = props;

  //click handlers:
  const handleLogin = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (e) {
      //current error handling does not catch and alert unsuccessful logouts
      console.log(`There was an error signing out: ${e.message}`);
    }
  }, [navigate]);

  const handleMenuLogoClick = () => {
    navigate("/");
  };

  const toggleDrawer = useCallback(
    (anchor, open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.type === "Tab" || event.type === "Shift")
      ) {
        return;
      }
      setMobileMenu({ ...mobileMenu, [anchor]: open });
    },
    [mobileMenu]
  );

  //useEffect hooks:
  useEffect(() => {
    const authenticatedPages = [
      ["Dashboard", "/admin/dashboard"],
      ["Add Page", "/admin/addPage"],
    ];
    setPages(currentUser ? authenticatedPages : []);
  }, [currentUser]);

  useEffect(() => {
    const authenticatedAccountButton = ["Log Out", handleLogout];
    const anonAccountButton = ["Log In", handleLogin];
    setAccountButton(
      currentUser ? authenticatedAccountButton : anonAccountButton
    );
  }, [currentUser, handleLogin, handleLogout]);

  useEffect(() => {
    if (currentUser) {
      setToggleIcon(<CustomMenuIcon onClick={toggleDrawer("left", true)} />);
    } else {
      setToggleIcon(null);
    }
  }, [currentUser, toggleDrawer]);

  //functional components:
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {pages.map((page) => (
          <ListItem key={page}>
            <Typography textAlign="center">
              <Link
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
                to={page[1]}
              >
                {page[0]}
              </Link>
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const NavbarLinksBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  const CustomMenuIcon = styled(MenuIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "none",
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  }));

  const NavbarContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
  }));

  return (
    <NavbarContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5rem",
        }}
      >
        {/* POP OUT MENU */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {toggleIcon}

          {/* POP OUT MENU DRAWER */}
          <Drawer
            anchor="left"
            open={mobileMenu["left"]}
            onClose={toggleDrawer("left", false)}
          >
            {/* INNER POP OUT MENU LOGO BUTTON */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 4, ml: 2 }}>
              <IconButton
                size="large"
                aria-label="Home"
                onClick={handleMenuLogoClick}
                color="primary"
              >
                <Typography
                  color="primary"
                  variant="h4"
                  sx={{
                    ml: 2,
                  }}
                >
                  Messenger of Lahar ADMIN
                </Typography>
              </IconButton>
            </Box>
            {list("left")}
          </Drawer>

          {/* LOGO BUTTON */}
          <Box>
            <IconButton
              size="large"
              aria-label="Home"
              onClick={handleMenuLogoClick}
            >
              <Typography
                color="primary"
                variant="h6"
                sx={{
                  ml: 1,
                }}
              >
                Messengers of Lahar ADMIN
              </Typography>
            </IconButton>
          </Box>
        </Box>

        {/* CENTER NAVBAR LINKS */}
        <NavbarLinksBox>
          {pages.map((page) => (
            <Link
              key={page}
              to={page[1]}
              style={{ textDecoration: "none", color: "#4F5361" }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {page[0]}
              </Typography>
            </Link>
          ))}
        </NavbarLinksBox>
      </Box>

      {/* LEFT ALIGNED ACCOUNT BUTTONS */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Button
          onClick={accountButton[1]}
          style={{ textDecoration: "none", color: "#4F5361" }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {accountButton[0]}
          </Typography>
        </Button>
      </Box>
    </NavbarContainer>
  );
};

Navbar.propTypes = {
  currentUser: PropTypes.object,
};

export default Navbar;

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { Button, TextField } from "@mui/material";
import { auth, db } from "../../firebase/config";
import PeopleIcon from "@mui/icons-material/People";
import { useFormik } from "formik";
import { user } from "../FriendSystem/FriendPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import User, { userConverter } from "../../data/User";

/**
 * The stylization for the searchbar
 */
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  backgroundColor: alpha(theme.palette.common.white, 0.35),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.4),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  overflow: "hidden",
}));

/**
 * More stylization for the searchbar
 */
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

/**
 * The stylized base for the navbar
 */
const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: "inherit",
  "& .MuiOutlinedInput-root": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
    },
  },
}));

let loggedUser: User;
let pulled = false;

/**
 * This is a universal navigation bar that will be implemented in all webpages for a given signed in user.
 * @returns Navigation bar
 */
export default function Navbar() {
  const [authUser] = useAuthState(auth);
  const [currUser, setUser] = React.useState(user);

  if (!user && !loggedUser && !pulled) {
    console.log();
    callDB(authUser?.uid, setUser);
    pulled = true;
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  /**
   * Handles the behavior when the profile menu is closed
   * @param event Mouse event
   */
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles the behavior when the profile menu is closed in mobile
   */
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  /**
   * Handles the behavior when the profile menu is closed
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  /**
   * Handles the behavior when the mobile modal is opened.
   * Sets the mobile anchor
   * @param event Mouse event
   */
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  /**
   * This is the default render view for the navbar
   */
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <a
        href="/components/Profile"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {" "}
        <MenuItem
          onClick={() => {
            handleMenuClose;
          }}
        >
          Profile
        </MenuItem>
      </a>
      <a
        href="/components/AccountSettings"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose;
          }}
        >
          My account
        </MenuItem>
      </a>
      <MenuItem>
        <Button variant="contained" onClick={() => signOut(auth)}>
          Sign out
        </Button>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  /**
   * This is the mobile render view for the navbar
   */
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
          onClick={() => {
            navigate("/components/Friends/requests");
          }}
        >
          <Badge
            badgeContent={
              user
                ? user.incomingRequests.length
                : currUser
                ? currUser.incomingRequests.length
                : 0
            }
            color="error"
          >
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Requests</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  /**
   * Input Validation using Formik
   */
  const validate = () => {
    const errors: { search?: string } = {};
    if (!formik.values.search) {
      errors.search = "Search must not be empty";
    }
    return errors;
  };

  const search = new URLSearchParams(window.location.hash.split("#")[1]).get(
    "q"
  );

  const formik = useFormik({
    initialValues: {
      search: search ? search : "",
    },
    validate,
    onSubmit: (values) => {
      navigate(`/components/Search#q=${values.search.replace(/\s/g, "")}`);
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "teal" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/components/Forum"
            sx={{
              mr: 3,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            HAWK
            <img
              src="https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2FMy_project.png?alt=media&token=9c88ec23-9c4e-46b7-8eb9-a907be7b2cfc"
              height="35px"
            />
            FINDER
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              display: { xs: "flex", md: "none" },
              paddingRight: { xs: "20px", md: "0" },
            }}
          >
            <a href="/components/Forum">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2FMy_project.png?alt=media&token=9c88ec23-9c4e-46b7-8eb9-a907be7b2cfc"
                height="35px"
              />
            </a>
          </Typography>
          <Search>
            <form onSubmit={formik.handleSubmit}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <TextField
                variant="filled"
                id="search"
                name="search"
                value={formik.values.search}
                onChange={formik.handleChange}
                error={formik.touched.search && Boolean(formik.errors.search)}
                sx={{ width: "100%" }}
                inputProps={{
                  style: {
                    paddingLeft: "50px",
                    margin: 0,
                    paddingTop: "15px",
                    paddingBottom: "15px",
                  },
                }}
              />
            </form>
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              href="/components/Friends/requests"
            >
              <Badge
                badgeContent={
                  user
                    ? user.incomingRequests.length
                    : loggedUser
                    ? loggedUser.incomingRequests.length
                    : 0
                }
                color="error"
              >
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              href="/components/Friends"
            >
              <Badge color="error">
                <PeopleIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

async function callDB(refreshUser: string | undefined, setUser: any) {
  if (user || !refreshUser) {
    return;
  }
  // Query Firestore for information from currently logged in user
  const querySnapshot = await getDoc(
    doc(db, "Users", refreshUser).withConverter(userConverter)
  );
  console.log("Pulling user for Navbar notifs");

  const dbUser = querySnapshot.data();
  if (dbUser !== undefined) {
    loggedUser = dbUser;
    setUser(loggedUser);
  }
}

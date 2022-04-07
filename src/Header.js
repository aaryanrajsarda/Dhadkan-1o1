import React from "react";
import "./Header.css";
import HomeIcon from "@material-ui/icons/Home";
import { Avatar, Tooltip, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Popover from "@material-ui/core/Popover";
import { Button, Typography } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";

function Header() {
  const [{ user }] = useStateValue();

  return (
    <div className="header row">
      <div className="header__left col-6 order-1 order-md-1 col-md-4">
        <img
          src="heartfavicon.jpg"
          alt="Dhadkan"
          style={{ borderRadius: "10%" }}
        />
        <h1 style={{ marginLeft: "5px" }}>Dhadkan</h1>
      </div>
      <div className="header__center col-12 order-2 order-md-2 col-md-4">
        <IconButton className="header__option d-block d-md-none">
          <MenuIcon style={{ color: " #16a596" }} fontSize="large" />
        </IconButton>
        <Menu id="simple-menu"></Menu>
      </div>
      <div className="header__right col-6 order-1 order-md-3 col-md-4">
        <Popover
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography>
            <Button style={{ color: "white", backgroundColor: "#16a596" }}>
              Logout
            </Button>
          </Typography>
        </Popover>
        <div className="header__info" style={{ cursor: "pointer" }}>
          <div className="header__option" id="home">
            <Tooltip title="Home">
              <NavLink to="/home">
                <HomeIcon style={{ color: " #16a596" }} fontSize="large" />
              </NavLink>
            </Tooltip>
          </div>
          <NavLink to="/profile">
            <Avatar src={user?.photoURL} alt={user?.displayName} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Header;

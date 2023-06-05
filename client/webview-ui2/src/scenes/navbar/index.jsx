import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Backdrop,
  Button,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Logout,
  Home,
  CheckCircleRounded,
  CancelRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const [confirmLogout, setConfirmLogout] = useState(false);

  const fullName = ` ${user.username} `;

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const handleCloseConfirmLogout = () => {
    setConfirmLogout(false);
  };

  const handleConfirmLogout = () => {
    setConfirmLogout(!confirmLogout);
  };

  return (
    <FlexBetween padding="0.7rem 7%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          variant="h2"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}>
          RPS Interface
        </Typography>
      </FlexBetween>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={confirmLogout}
        onClick={handleCloseConfirmLogout}>
        <WidgetWrapper>
          <Typography
            variant="h3" 
            align="center"
            color={theme.palette.neutral.mediumMain}
          >
            Are you sure you want
          </Typography>
          <Typography
            variant="h3" 
            align="center"
            color={theme.palette.neutral.mediumMain}
          >
            to logout?
          </Typography>
          <IconButton
            onClick={() => {
              dispatch(setLogout());
              navigate("/");
            }}
            sx={{
              marginTop: "1rem",
              marginLeft: "4.7rem",
            }}>
            <CheckCircleRounded fontSize="large" color="success" />
          </IconButton>
          <IconButton
            sx={{
              marginTop: "1rem",
            }}
          >
            <CancelRounded fontSize="large" color="error" />
          </IconButton>
        </WidgetWrapper>
      </Backdrop>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => navigate("/home")}>
            <Home sx={{ fontSize: "1.5rem" }} />
          </IconButton>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "1.5rem" }} />
            ) : (
              <LightMode sx={{ fontSize: "1.5rem" }} />
            )}
          </IconButton>
          <IconButton onClick={handleConfirmLogout}>
            <Logout sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}>
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem">
            <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  "backgroundColor": neutralLight,
                  "width": "150px",
                  "borderRadius": "0.25rem",
                  "p": "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}>
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                  }}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;

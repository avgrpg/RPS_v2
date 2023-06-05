import { Box, Typography, Divider, useTheme, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { apiUrl } from "../../../../src/constants";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import ExamsWidget from "../widgets/ExamsWidget";

const UserWidget = ({ userId }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const apiUrl = useSelector((state) => state.apiUrl);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  // getUser called when first render the component
  useEffect(() => {
    getUser();
  }, []);

  // error out before the component is rendered
  if (!user) {
    return null;
  }

  // destructure user object
  const { username, EID } = user;

  return (
    <WidgetWrapper>
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem" // padding-bottom
        onClick={() => navigate(`/home`)}>
          <Box>
            <Typography
              variant="h5"
              color={palette.neutral.dark}
              fontWeight="bold"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}>
              {username}
            </Typography>
            <Typography color={palette.neutral.medium}> {EID}</Typography>
          </Box>
        <Avatar>{username[0]}</Avatar>
      </FlexBetween>
      <Divider />
      <Box p="1.5rem 0">
        <ExamsWidget userId={userId} />
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;

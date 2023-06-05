import {Typography, Divider, useTheme } from "@mui/material";

import WidgetWrapper from "../../components/WidgetWrapper";

const InfoWidget = () => {
  const { palette } = useTheme();

  return (
    <WidgetWrapper>
      <Typography variant="h4" color={palette.neutral.main}>
        Welcome to RPS interface
      </Typography>
      <Divider sx={{ margin: "1rem 0" }} />
      <Typography variant="h5" color={palette.neutral.mediumMain} margin="1rem 0">
        Click on an exam to start.
      </Typography>
      <Typography variant="h5" color={palette.neutral.mediumMain} margin="1rem 0">
        View candidate's suspicious score.
      </Typography>
      <Typography variant="h5" color={palette.neutral.mediumMain} margin="1rem 0">
        View typing stat, clipboard history, enabled extension list.
      </Typography>
      <Typography variant="h5" color={palette.neutral.mediumMain} margin="1rem 0">
        Even replay candidate's answers.
      </Typography>
    </WidgetWrapper>
  );
};

export default InfoWidget;

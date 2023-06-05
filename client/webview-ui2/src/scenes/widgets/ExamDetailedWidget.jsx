import { Typography, Divider, useTheme } from "@mui/material";

import WidgetWrapper from "../../components/WidgetWrapper";

const ExamDetailedWidget = ({
  language,
  suspiciousTypingSpeed,
  suspiciousClipboardLength,
  suspiciousStandardDeviation,
  disallowedExtensions
}) => {
  const { palette } = useTheme();

  return (
    <WidgetWrapper
      sx={{
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography variant="h6" color={palette.neutral.main}>
        Exam Detail
      </Typography>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
        Language: {language}
      </Typography>
      <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
        Suspicious Typing Speed: {suspiciousTypingSpeed}
      </Typography>
      <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
        Suspicious Clipboard Length: {suspiciousClipboardLength}
      </Typography>
      <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
        Suspicious Standard Deviation: {suspiciousStandardDeviation}
      </Typography>
      <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
        Disallowed Extension:
      </Typography>
      {disallowedExtensions.map((extension, index) => (
        <Typography key={index} variant="h7" color={palette.neutral.main} margin="0.25rem 1rem">
          {extension}
        </Typography>
      ))}
    </WidgetWrapper>
  );
};

export default ExamDetailedWidget;

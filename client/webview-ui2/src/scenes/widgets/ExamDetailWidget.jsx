import { Typography, Divider, Switch, FormControlLabel, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import WidgetWrapper from "../../components/WidgetWrapper";
import ExamDetailedWidget from "./ExamDetailedWidget";

const ExamDetailWidget = (examId) => {
  const { palette } = useTheme();
  const exams = useSelector((state) => state.exams);
  const selectedExam = useSelector((state) => state.selectedExam);
  const [exam, setExam] = useState(null);
  const [switched, setSwitched] = useState(false);

  const handleSwitch = () => {
    setSwitched(!switched);
  };

  useEffect(() => {
    const findExam = exams.find((exam) => exam._id === examId.examId);
    setExam(findExam);
  }, [examId]);

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
      {exam && (
        <>
          <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
            Language: {exam.language}
          </Typography>
          <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
            Suspicious Typing Speed: {exam.suspiciousTypingSpeed}
          </Typography>
          <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
            Suspicious Clipboard Length: {exam.suspiciousClipboardLength}
          </Typography>
          <Typography variant="h7" color={palette.neutral.main} margin="0.25rem 0">
            Suspicious Standard Deviation: {exam.suspiciousStandardDeviation}
          </Typography>
          <FormControlLabel
            control={<Switch checked={switched} onChange={handleSwitch} />}
            label="Show disallowed extensions"
            sx={{
              color: palette.neutral.main,
            }}
          />
          {switched && (
            <>
              {exam.disallowedExtensions.map((extension, index) => (
                <Typography
                  key={index}
                  variant="h7"
                  color={palette.neutral.main}
                  margin="0.25rem 1rem">
                  {extension}
                </Typography>
              ))}
            </>
          )}
        </>
      )}
    </WidgetWrapper>
  );
};

export default ExamDetailWidget;

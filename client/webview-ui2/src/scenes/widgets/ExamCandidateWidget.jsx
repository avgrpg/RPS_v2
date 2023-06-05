import { Box, Typography, Divider, useTheme, Tabs, Tab, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import HistoryLogWidget from "./HistoryLogWidget";
import OverviewWideget from "./OverviewWideget";
import ClipboardWidget from "./ClipboardWidget";
import StatWidget from "./StatWidget";
import ExtensionWidget from "./ExtensionWidget";
// import { apiUrl } from "../../../../src/constants";

const ExamCandidateWidget = (canId) => {
  const { palette } = useTheme();

  const token = useSelector((state) => state.token);
  const selectedExam = useSelector((state) => state.selectedExam);
  const exams = useSelector((state) => state.exams);
  const apiUrl = useSelector((state) => state.apiUrl);
  const [value, setValue] = useState(0);
  const [candidate, setCandidate] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCanDetail = async () => {
    // passing an object called canId which has the poperty canId
    const response = await fetch(`${apiUrl}/exams/${selectedExam}/${canId.canId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setCandidate(data);
  };

  useEffect(() => {
    getCanDetail();
  }, []);

  return (
    <WidgetWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          width: "100%",
        }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}>
          <Tabs value={value} variant="fullWidth" onChange={handleChange}>
            <Tab label="Overview" />
            <Tab label="Stat" />
            <Tooltip title="Show full history log">
              <Tab label="History" />
            </Tooltip>
            <Tab label="Clipboard" />
            <Tab label="Extension" />
          </Tabs>
        </Box>
        {value === 0 && (
          <Box sx={{ p: 3 }}>
            <OverviewWideget
              name={candidate.name}
              EID={candidate.EID}
              score={candidate.score}
              startTime={candidate.startTime}
              endTime={candidate.endTime}
              {...candidate.scoreBoard}
            />
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ p: 3 }}>
            <StatWidget speedLog={candidate.averageSpeed}/>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ p: 3 }}>
            <HistoryLogWidget historyLog={candidate.historyLog} />
          </Box>
        )}
        {value === 3 && (
          <Box sx={{ p: 3 }}>
            <ClipboardWidget clipboard={candidate.clipboardLog} />
          </Box>
        )}
        {value === 4 && (
          <Box sx={{ p: 3 }}>
            <ExtensionWidget extensionList={candidate.extensionList}/>
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default ExamCandidateWidget;

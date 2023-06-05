import { Scoreboard } from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";

import FlexBetween from "../../components/FlexBetween";

const OverviewWideget = ({
  name,
  EID,
  score,
  startTime,
  endTime,
  clipboardLog,
  averageSpeed,
  extensionLog,
  standardDeviation,
  meanSpeed,
}) => {
  const { palette } = useTheme();

  // let computedAverageSpeed = 0;
  const [computedAverageSpeed, setComputedAverageSpeed] = useState(null);
  const [stat, setStat] = useState([]);
  const [switched, setSwitched] = useState(false);

  const returnBgcolor = (score) => {
    if (score > 70) {
      // red
      return "error.main";
    }
    if (score > 30) {
      // blue
      return "info.main";
    }
    //green
    return "success.main";
  };

  const handleSwitch = () => {
    setSwitched(!switched);
  };

  useEffect(() => {
    if (averageSpeed) {
      setComputedAverageSpeed(averageSpeed.reduce((a, b) => a + b.speed, 0) / averageSpeed.length);
    }
    if (meanSpeed && standardDeviation) {
      for (let i = 0; i < meanSpeed.length; i++) {
        stat.push({
          file: meanSpeed[i].file,
          mean: meanSpeed[i].mean,
          sd: standardDeviation[i].sd,
        });
      }
    }
  }, [averageSpeed]);

  return (
    <div>
      <FlexBetween padding="0.75rem">
        <Box>
          <Typography variant="h5" m="0.5rem" color={palette.neutral.main}>
            {name}
          </Typography>
          <Typography variant="h5" m="0.5rem" color={palette.neutral.main}>
            {EID}
          </Typography>
        </Box>
        <Tooltip title="Suspicious Score" followCursor>
          <Avatar
            sx={{
              bgcolor: returnBgcolor(score),
              fontSize: "1.5rem",
              color: palette.neutral.main,
              width: "56px",
              height: "56px",
            }}>
            {/* {Math.round(score)} */}
            {score ? Math.round(score) : ""}
          </Avatar>
        </Tooltip>
      </FlexBetween>
      <Divider sx={{ marginBottom: "1rem" }} />
      <FlexBetween>
        <Tooltip title="Suspicious score on clipbard">
          <FlexBetween sx={{ justifyContent: "flex-start" }}>
            <Typography variant="h5" color={palette.neutral.main}>
              Clipboard Score:{" "}
            </Typography>
            <Avatar
              sx={{
                bgcolor: returnBgcolor(clipboardLog),
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}>
              {clipboardLog}
            </Avatar>
          </FlexBetween>
        </Tooltip>
        <Tooltip title="Suspicious score on typing behaviour">
          <FlexBetween sx={{ justifyContent: "flex-start" }}>
            <Typography variant="h5" color={palette.neutral.main}>
              Typing Speed Score:{" "}
            </Typography>
            <Avatar
              sx={{
                bgcolor: returnBgcolor(computedAverageSpeed),
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}>
              {Math.round(computedAverageSpeed)}
            </Avatar>
          </FlexBetween>
        </Tooltip>
        <Tooltip title="Show whether candidate has enabled disallowed extension">
          <FlexBetween sx={{ justifyContent: "flex-start" }}>
            <Typography variant="h5" color={palette.neutral.main}>
              Extension Score:{" "}
            </Typography>
            <Avatar
              sx={{
                bgcolor: returnBgcolor(extensionLog),
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}>
              {extensionLog}
            </Avatar>
          </FlexBetween>
        </Tooltip>
      </FlexBetween>
      <Divider sx={{ margin: "1rem 0" }} />

      <Typography variant="h5" color={palette.neutral.main} m="0.25rem 0">
        Start Time: {startTime}
      </Typography>
      <Typography variant="h5" color={palette.neutral.main} m="0.25rem 0">
        End Time: {endTime}
      </Typography>
      <Divider sx={{ margin: "1rem 0" }} />
      <FormControlLabel
        control={<Switch checked={switched} onChange={handleSwitch} />}
        label="additional information"
        sx={{
          color: palette.neutral.medium,
        }}
      />
      {switched && (
        // <>
        //   {meanSpeed &&
        //     meanSpeed.map((item, index) => (
        //       <Typography key={index} variant="h5" color={palette.neutral.main} m="0.25rem 0">
        //         Average Typing Speed of {item.file}: {Math.round(item.mean)}
        //       </Typography>
        //     ))}
        //   <Divider sx={{ margin: "1rem 0" }} />
        //   {standardDeviation &&
        //     standardDeviation.map((item, index) => (
        //       <Typography key={index} variant="h5" color={palette.neutral.main} m="0.25rem 0">
        //         Standard Deviation of {item.file}: {Math.round(item.sd)}
        //       </Typography>
        //     ))}
        // </>
        <>
          {stat.map((item, index) => (
            <Typography key={index} variant="h5" color={palette.neutral.main} m="0.25rem 0">
              File {item.file}: Mean Speed: {Math.round(item.mean)} Standard Deviation:{" "}
              {Math.round(item.sd)}
            </Typography> 
          ))}
        </>
      )}
    </div>
  );
};

export default OverviewWideget;

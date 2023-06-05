import { useEffect, useState } from "react";
import {
  useTheme,
  Select,
  Box,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import FlexBetween from "../../components/FlexBetween";
import CodePlayWideget from "./CodePlayWideget";

const HistoryLogWidget = ({ historyLog }) => {
  const { palette } = useTheme();
  const [timeValue, setTimeValue] = useState(0);
  const [playPause, setPlayPause] = useState(false);
  const [file, setFile] = useState("");

  const [playContent, setPlayContent] = useState(historyLog[0].content);
  // const [playTime, setPlayTime] = useState(historyLog[0].content.length - 1);

  // let playContent = historyLog[0].content;
  // let playTime = historyLog[0].content.length - 1;
  // const playLimit = historyLog[0].content.length - 1;

  const handleSliderChange = (event, newValue) => {
    setTimeValue(newValue);
  };

  // useEffect(() => {
  //   if (playPause) {
  //     interval = setInterval(() => {
  //       setTimeValue((previousValue) => (previousValue + 1) % (playTime + 1));
  //     }, 1000);
  //   } else {
  //     clearInterval(interval);
  //   }
  // }, [playPause]);

  // useEffect(() => {
  //   if (timeValue === playTime) {
  //     setPlayPause(false);
  //     clearInterval(interval);
  //   }
  // }, [timeValue]);

  const handleSelectChange = (event) => {
    setFile(event.target.value);
    // console.log(event.target.value);
    // playContent = historyLog.find(({ fileN }) => fileN === event.target.value).content;
    // console.log(playContent);
    setPlayContent(historyLog.find(({ fileN }) => fileN === event.target.value).content);
    // setPlayTime(playContent.length - 1);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>File</InputLabel>
        <Select value={file} label="File" onChange={handleSelectChange}>
          {historyLog.map(({ fileN }) => (
            <MenuItem value={fileN} key={fileN}>{fileN}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <CodePlayWideget playContentObj={playContent}/>
      {/* <Grid container spacing={2} alignItems="center">
        <Grid
          item
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={handlePlayPause}>
          {playPause ? <PauseRounded /> : <PlayArrowRounded />}
        </Grid>
        <Grid item xs>
          <Slider
            defaultValue={0}
            onChange={handleSliderChange}
            value={timeValue}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={playTime}
            sx={{
              color: palette.primary.main,
            }}
          />
        </Grid>
      </Grid>
      <SyntaxHighlighter language="javascript" style={codeStyle()}>
        {playContent[timeValue].content}
      </SyntaxHighlighter> */}
    </div>
  );
};

export default HistoryLogWidget;
//  {historyLog[0].content[timeValue].content}
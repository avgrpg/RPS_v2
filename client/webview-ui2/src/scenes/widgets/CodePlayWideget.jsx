import { PlayArrowRounded, PauseRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  Slider,
  Grid,
  useTheme,
  Select,
  Box,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useSelector } from "react-redux";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

let interval = undefined;
const CodePlayWideget = (playContentObj) => {
  const { palette } = useTheme();
  const [timeValue, setTimeValue] = useState(0);
  const [playPause, setPlayPause] = useState(false);
  let playContent = playContentObj.playContentObj;
  const language = useSelector((state) => state.currentLanguage);
//   let playTime = 10;
  // let playTime = 10;
//   const [playContent, setPlayContent] = useState(playContentObj.playContentObj);
  const [playTime, setPlayTime] = useState(playContent.length-1);

  const handleSliderChange = (event, newValue) => {
    setTimeValue(newValue);
  };

  const handlePlayPause = () => {
    setPlayPause(!playPause);
  };

  const codeStyle = () => {
    if (palette.code.default === "vs") {
      return vs;
    }
    if (palette.code.default === "vscDarkPlus") {
      return vscDarkPlus;
    }
  };

  useEffect(() => {
    // setPlayContent(playContentObj.playContentObj);
    setPlayTime(playContent.length - 1);

  }, [playContentObj]);

  useEffect(() => {
    if (playPause) {
      interval = setInterval(() => {
        setTimeValue((previousValue) => (previousValue + 1) % (playTime + 1));
      }, 1000);
    } else {
      clearInterval(interval);
    }
  }, [playPause]);

  useEffect(() => {
    if (timeValue === playTime) {
      setPlayPause(false);
      clearInterval(interval);
    }
  }, [timeValue]);

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
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
      <SyntaxHighlighter language={language} style={codeStyle()} wrapLongLines={true}>
        {/* {historyLog[0].content[timeValue].content} */}
        {playContent[timeValue]}
        {/* {playContentObj.playContentObj[timeValue].content} */}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodePlayWideget;

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
import { useEffect, useState } from "react";

import GraphWidget from "./GraphWidget";

const StatWidget = ({ speedLog }) => {
  const [file, setFile] = useState("");
  const [statContent, setStatContent] = useState(null);

  const composeSpeedData = (data) => {
    return data.map((item, index) => {
      return {
        id: item.fileN,
        color: "hsl(" + (((index + 1) * 30) % 360) + ", 100%, 50%)",
        data: item.speed.map((speed, index) => {
          return {
            x: index,
            y: speed,
          };
        }),
      };
    });
  };

  const handleSelectChange = (event) => {
    setFile(event.target.value);
    // setStatContent(speedLog.find(({ fileN }) => fileN === event.target.value).speed);
    let tmp = speedLog.find(({ fileN }) => fileN === event.target.value).speed;
    let tmp2 = tmp.map((item, index) => {
      return { speed: item, index: index };
    });
    let tmp3 = composeSpeedData(speedLog);
    setStatContent(tmp3);
  };

  useEffect(() => {
    console.log(speedLog);
  }, []);
  return (
    <div style={{ height: 500 }}>
      {/* <FormControl fullWidth>
        <InputLabel>File</InputLabel>
        <Select value={file} label="File" onChange={handleSelectChange}>
          {speedLog.map(({ fileN }) => (
            <MenuItem value={fileN} key={fileN}>
              {fileN}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <GraphWidget speedLog={composeSpeedData(speedLog)} />
    </div>
  );
};

export default StatWidget;

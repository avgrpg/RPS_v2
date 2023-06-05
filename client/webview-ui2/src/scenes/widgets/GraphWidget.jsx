import { ResponsiveLine } from "@nivo/line";
import { useEffect } from "react";
import { useTheme } from "@mui/material";

const GraphWidget = (speedLog) => {
  const { palette } = useTheme();

  useEffect(() => {
    
    console.log(speedLog);
  }, []);

  return (
    <ResponsiveLine
      data={speedLog.speedLog}
      margin={{
        top: 50,
        right: 110,
        bottom: 50,
        left: 60,
      }}
      xScale={{
        type: "linear",
      }}
      yScale={{
        type: "linear",
      }}
      minY="auto"
      maxY="auto"
      stacked={true}
      curve="linear"
      theme={{
        textColor: palette.neutral.main,
        fontSize: 15,
      }}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Time Interval (5s per interval)",
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Speed (characters per second)",
        legendOffset: -50,
        legendPosition: "middle",
      }}
      lineWidth={3}
      legends={[
        {
          anchor: "top",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 30,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 1,
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: palette.background.alt,
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default GraphWidget;

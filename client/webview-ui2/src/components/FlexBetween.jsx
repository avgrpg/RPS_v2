import { Box } from "@mui/material";
import { styled } from "@mui/system";

// styled components for reuse
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
import { useTheme, Typography, Divider, Tooltip } from "@mui/material";
import { BlockRounded, Info } from "@mui/icons-material";

const ExtensionWidget = ({ extensionList }) => {
  return (
    <div>
      <Tooltip title="Red color indicating the extension enabled is not allowed." placement="right">
        <Info
          fontSize="small"
          color="disabled"
          sx={{
            "&:hover": { color: "inherit" },
          }}
        />
      </Tooltip>

      {extensionList.map((extension, index) => (
        <Typography
          variant="h5"
          sx={{
            color: extension.disallow && "red",
          }}
          key={index}>
          {extension.disallow && (
            <BlockRounded
              fontSize="small"
              key={index}
              sx={{
                marginRight: "0.2rem",
              }}
            />
          )}
          {extension.id}
        </Typography>
      ))}
    </div>
  );
};

export default ExtensionWidget;

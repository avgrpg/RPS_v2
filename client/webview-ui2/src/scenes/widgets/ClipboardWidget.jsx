import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

const ClipboardWidget = ({ clipboard }) => {
  const { palette } = useTheme();
  const language = useSelector((state) => state.currentLanguage);

  const codeStyle = () => {
    if (palette.code.default === "vs") {
      return vs;
    }
    if (palette.code.default === "vscDarkPlus") {
      return vscDarkPlus;
    }
  };

  return (
    <SyntaxHighlighter language={language} style={codeStyle()} wrapLongLines={true}>
      {clipboard.reduce(
        (acc, { content, time }) =>
          acc +
          "// Time : " +
          time +
          "\n" +
          "/********** Clipboard content: **********/\n" +
          content +
          "\n" +
          "/******* End of clipboard content *******/\n\n",
        "// Clipboard content:\n"
      )}
    </SyntaxHighlighter>
  );
};

export default ClipboardWidget;

// {clipboard.map(({ content, time }) => (
//   <SyntaxHighlighter language="javascript" style={vs}>
//     {"// Time : " +
//       time +
//       "\n" +
//       "/******* Clipboard content: *******/\n" +
//       content +
//       "\n" +
//       "/******* End of clipboard content *******/\n"}
//   </SyntaxHighlighter>
// ))}

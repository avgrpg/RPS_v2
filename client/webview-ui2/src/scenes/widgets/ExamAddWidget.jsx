import {
  AddCircle,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Slider,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vscode } from "../../utilities/vscode";
import { setExams } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
// import { apiUrl } from "../../../../src/constants";

const DISALLOWED_EXTENSIONS = [
  "TabNine.tabnine-vscode",
  "GitHub.copilot",
  "VisualStudioExptTeam.vscodeintellicode",
  "timkmecl.chatgpt",
  "gencay.vscode-chatgpt",
];

const ExamAddWidget = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const apiUrl = useSelector((state) => state.apiUrl);

  const [exam, setExam] = useState("");
  const [language, setLanguage] = useState("");
  const [switched, setSwitched] = useState(false);
  const [sliderValue, setSliderValue] = useState(12.5);
  const [sliderValue2, setSliderValue2] = useState(15);
  const [sliderValue3, setSliderValue3] = useState(2);
  const [dExtension, setDExtension] = useState("");
  const [dExtensionList, setDExtensionList] = useState([...DISALLOWED_EXTENSIONS]);

  const handleExamAdd = async () => {
    const data = {
      userId: _id,
      examCode: exam,
      language: language,
      suspiciousTypingSpeed: sliderValue,
      suspiciousClipboardLength: sliderValue2,
      suspiciousStandardDeviation: sliderValue3,
      disallowedExtensions: dExtensionList,
    };
    const reponse = await fetch(`${apiUrl}/add/exam`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!reponse.ok) {
      vscode.postMessage({
        command: "error",
        text: "Exam already added",
      });
      return;
    } else {
      const exams = await reponse.json();
      dispatch(setExams({ exams }));
      setSwitched(false);
      setExam("");

    }
  };

  const handleExamInput = (event) => {
    setExam(event.target.value);
    if (event.target.value === "") {
      setSwitched(false);
    }
  };

  const handleLanguageInput = (event) => {
    setLanguage(event.target.value);
  };

  const handleSwitch = (event) => {
    setSwitched(event.target.checked);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSliderChange2 = (event, newValue) => {
    setSliderValue2(newValue);
  };

  const handleSliderChange3 = (event, newValue) => {
    setSliderValue3(newValue);
  };

  const handleDExtensionInput = (event) => {
    setDExtension(event.target.value);
  };

  const handleAddDExtension = () => {
    setDExtensionList([dExtension, ...dExtensionList]);
    setDExtension("");
  };

  const handleDeleteDExtension = (index) => {
    setDExtensionList(dExtensionList.filter((e, i) => i !== index));
  };

  const handleAdd = () => {
    console.log(
      exam,
      language,
      sliderValue,
      sliderValue2,
      sliderValue3,
      dExtensionList
    );
  };

  return (
    <WidgetWrapper>
      <FlexBetween>
        <InputBase
          placeholder="Type to add exam. Eg. 2223A_EE1234"
          onChange={handleExamInput}
          value={exam}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {exam && (
        <>
          <FlexBetween sx={{ margin: "1.25rem" }}>
            <Typography variant="h5" color={palette.neutral.mediumMain}>
              Programming Language:
            </Typography>
            <InputBase
              placeholder="eg. js"
              onChange={handleLanguageInput}
              value={language}
              sx={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: palette.neutral.light,
                width: "35%",
              }}
            />
          </FlexBetween>
        </>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FormControlLabel
          control={
            <Switch disabled={!exam ? true : false} checked={switched} onChange={handleSwitch} />
          }
          label="additional configuation"
          sx={{
            color: palette.neutral.medium,
          }}
        />
        <Button
          disabled={!exam}
          onClick={handleExamAdd}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}>
          Add
        </Button>
      </FlexBetween>
      {switched && (
        <>
          <Divider sx={{ margin: "1.25rem 0" }} />
          <Typography
            variant="h5"
            color={palette.neutral.mediumMain}
            sx={{
              marginTop: "1.5rem",
            }}>
            Suspicious typing speed: {sliderValue} (characters per second)
          </Typography>
          <Slider
            defaultValue={12.5}
            valueLabelDisplay="auto"
            step={0.5}
            marks
            min={5}
            max={17}
            onChange={handleSliderChange}
            value={sliderValue}
          />
          <Typography
            variant="h5"
            color={palette.neutral.mediumMain}
            sx={{
              marginTop: "1.5rem",
            }}>
            Suspicious clipboard content length: {sliderValue2} (characters)
          </Typography>
          <Slider
            defaultValue={15}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={10}
            max={100}
            onChange={handleSliderChange2}
            value={sliderValue2}
          />
          <Typography
            variant="h5"
            color={palette.neutral.mediumMain}
            sx={{
              marginTop: "1.5rem",
            }}>
            Suspicious standard deviation: {sliderValue3}
          </Typography>
          <Slider
            defaultValue={2}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2}
            max={10}
            onChange={handleSliderChange3}
            value={sliderValue3}
          />
          <FlexBetween
            sx={{
              marginTop: "1.5rem",
            }}>
            <Typography variant="h5" color={palette.neutral.mediumMain}>
              Disallowed Extensions:
            </Typography>
            <FlexBetween
              sx={{
                justifyContent: "flex-end",
              }}>
              <InputBase
                value={dExtension}
                onChange={handleDExtensionInput}
                sx={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  backgroundColor: palette.neutral.light,
                  width: "100%",
                }}
              />
              <IconButton onClick={handleAddDExtension}>
                <AddCircle />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
          <Divider sx={{ margin: "1.25rem 0" }} />
          {dExtensionList.map((extension, index) => (
            <FlexBetween key={index} sx={{ justifyContent: "flex-start" }}>
              <IconButton
                onClick={() => {
                  handleDeleteDExtension(index);
                }}>
                <Delete />
              </IconButton>
              <Typography variant="h5" color={palette.neutral.mediumMain}>
                {extension}
              </Typography>
            </FlexBetween>
          ))}
        </>
      )}
    </WidgetWrapper>
  );
};

export default ExamAddWidget;

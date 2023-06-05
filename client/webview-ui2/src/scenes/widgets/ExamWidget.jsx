import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Delete,
  CheckCircleRounded,
  CancelRounded,
} from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography, Backdrop, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedExam, setCurrentLanguage } from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
// import { apiUrl } from "../../../../src/constants";

const ExamWidget = ({ examId, examHostId, examHostName, examCode, language }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const apiUrl = useSelector((state) => state.apiUrl);
  const { palette } = useTheme();
  const theme = useTheme();
  const [isSelect, setIsSelect] = useState(false);
  const selectedExam = useSelector((state) => state.selectedExam);
  const [showDelete, setShowDelete] = useState(false);
  const [deletedExamId, setDeletedExamId] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (selectedExam === examId) {
      setIsSelect(true);
    } else {
      setIsSelect(false);
    }
  });

  const handleSelect = () => {
    setIsSelect(!isSelect);
    dispatch(setSelectedExam({ selectedExam: examId }));
    dispatch(setCurrentLanguage({ currentLanguage: language }));
    navigate(`/exam/${examId}`);
  };

  const handleShowDelete = () => {
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleDelete = async () => {
    const reponse = await fetch(`${apiUrl}/users/delete/${examId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const response = await reponse.json();
    setDeletedExamId(response);
    navigate("/home");
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={confirmDelete}
        onClick={handleCloseConfirmDelete}>
        <WidgetWrapper>
          <Typography variant="h3" align="center" color={theme.palette.neutral.mediumMain}>
            Are you sure you want
          </Typography>
          <Typography variant="h3" align="center" color={theme.palette.neutral.mediumMain}>
            to delete it?
          </Typography>
          <IconButton
            onClick={() => {
              handleDelete();
            }}
            sx={{
              marginTop: "1rem",
              marginLeft: "4.7rem",
            }}>
            <CheckCircleRounded fontSize="large" color="success" />
          </IconButton>
          <IconButton
            sx={{
              marginTop: "1rem",
            }}>
            <CancelRounded fontSize="large" color="error" />
          </IconButton>
        </WidgetWrapper>
      </Backdrop>
      {!deletedExamId && (
        <Box
          display="flex"
          flexDirection="row"
          onMouseOver={handleShowDelete}
          onMouseLeave={handleCloseDelete}>
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            gap="1rem"
            mb="0.5rem"
            onClick={() => {
              handleSelect();
            }}
            sx={{
              "border": 1,
              "borderColor": palette.neutral.main,
              "borderRadius": "0.5rem",
              "backgroundColor": isSelect ? palette.neutral.medium : palette.background.alt,
              "&:hover": {
                backgroundColor: isSelect ? palette.neutral.medium : palette.primary.dark,
                opacity: isSelect ? 0.5 : 0.7,
              },
            }}>
            <Typography
              fontSize="Large"
              paddingLeft="1rem"
              paddingRight="1rem"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
                "color": isSelect ? palette.neutral.light : palette.neutral.main,
              }}>
              {examCode}
            </Typography>
          </Box>
          {showDelete && (
            <IconButton
              sx={{
                marginBottom: "0.5rem",
              }}
              onClick={handleConfirmDelete}>
              <Delete />
            </IconButton>
          )}
        </Box>
      )}
    </>
  );
};

export default ExamWidget;

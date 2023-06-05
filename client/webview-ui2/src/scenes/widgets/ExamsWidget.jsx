import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExams } from "../../state";
import { Button, Typography, useTheme } from "@mui/material";

import ExamWidget from "../widgets/ExamWidget";
// import { apiUrl } from "../../../../src/constants";

const ExamsWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const {palette} = useTheme();
  const exams = useSelector((state) => state.exams);
  const token = useSelector((state) => state.token);
  const apiUrl = useSelector((state) => state.apiUrl);
  // const selectedExam = useSelector((state) => state.selectedExam);

  const getExams = async () => {
    const response = await fetch(`${apiUrl}/users/${userId}/exams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch(setExams({ exams: data }));
  };

  // init call function
  useEffect(() => {
    getExams();
  }, []);

  return (
    <div>
      <Typography
        paddingBottom="0.7rem"
        variant="h4"
        color={palette.neutral.mediumMain}
      >
        {exams.length} Exams Hosted:
      </Typography>
      {exams.map(
        ({
          _id,
          userId,
          username,
          examCode,
          language,
          candidate
        }) => (
          <ExamWidget
            key={_id}
            examId={_id}
            examHostId={userId}
            examHostName={username}
            examCode={examCode}
            language={language}
          />
        )
      )}
    </div>
  );
};

export default ExamsWidget;

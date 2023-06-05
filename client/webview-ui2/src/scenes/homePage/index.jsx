import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import ExamAddWidget from "../widgets/ExamAddWidget";
import ExamsWidget from "../widgets/ExamsWidget";
import InfoWidget from "../widgets/InfoWidget";
import { setSelectedExam, setExams } from "../../state";

const HomePage = () => {
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setSelectedExam({selectedExam: null}));
    // dispatch(setExams({exams: []}));
  }, []);

  return (
      <Box>
        <Navbar />
        <Box
          width="100%"
          padding="2rem 6%"
          display="flex"
          gap="0.5rem"
          justifyContent="space-between">
          <Box flexBasis="26%">
            <UserWidget userId={_id} />
          </Box>
          <Box
            flexBasis="42%">
            <ExamAddWidget />
          </Box>
            <Box flexBasis="26%">
              <InfoWidget />
            </Box>
        </Box>
      </Box>
  );
};

export default HomePage;

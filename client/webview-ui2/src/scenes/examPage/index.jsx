import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import ExamAddWidget from "../widgets/ExamAddWidget";
import CandidatesWidget from "../widgets/CandidatesWidget";
import ExamDetailWidget from "../widgets/ExamDetailWidget";

// show the detail of the exam page
const ExamPage = () => {
  const { _id } = useSelector((state) => state.user);
  const { examId } = useParams();

  return (
    <Box>
      <Navbar />
      <Box width="100%" padding="2rem 6%" display="flex" gap="1rem" justifyContent="space-between">
        <Box flexBasis="26%">
          <UserWidget userId={_id} />
        </Box>
        <Box flexBasis="50%">
          <CandidatesWidget examId={examId} />
        </Box>
        <Box flexBasis="24%">
          <ExamDetailWidget examId={examId}/>
        </Box>
      </Box>
    </Box>
  );
};

export default ExamPage;

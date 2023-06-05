import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import ExamAddWidget from "../widgets/ExamAddWidget";
import ExamCandidateWidget from "../widgets/ExamCandidateWidget";

const CandidatePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);
  const { canId } = useParams();

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between">
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "74%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}>
          {/* {state && <CandidatesWidget examId={examId} />}
          {!state && <ExamCandidateWidget selectedExam={examId} />} */}
          <ExamCandidateWidget canId={canId}/>
        </Box>
      </Box>
    </Box>
  );
};

export default CandidatePage;

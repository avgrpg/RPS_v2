import {
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableContainer,
  TableBody,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import WidgetWrapper from "../../components/WidgetWrapper";
// import { apiUrl } from "../../../../src/constants";

const CandidatesWidget = (examId) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const selectedExam = useSelector((state) => state.selectedExam);

  const [candidates, setCandidates] = useState([]);
  const apiUrl = useSelector((state) => state.apiUrl);

  const getCan = async () => {
    const response = await fetch(`${apiUrl}/exams/${selectedExam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setCandidates(data);
  };

  const handleSelect = (id) => {
    navigate(`/can/${id}`);
  };

  const returnColor = (score) => {
    if (score > 70) {
      // red
      return "error.main";
    }
    if (score > 30) {
      // blue
      return "info.main";
    }
    //green
    return "success.main";
  };

  useEffect(() => {
    getCan();
  }, [examId]);

  return (
    <WidgetWrapper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>EID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                onClick={() => {
                  handleSelect(candidate.id);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: palette.primary.dark,
                    opacity: 0.3,
                    cursor: "pointer",
                  },
                }}>
                <TableCell component="th" scope="row">
                  {candidate.EID}
                </TableCell>
                <TableCell align="left">{candidate.name}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: returnColor(candidate.score),
                  }}>
                  {Math.round(candidate.score)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </WidgetWrapper>
  );
};

export default CandidatesWidget;

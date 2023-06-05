// import User from "../models/User.js";
import Exam from "../models/Exam.js";
import jwt from "jsonwebtoken";
import Candidate from "../models/Candidate.js";

// getCan, addOrUpdateCan

export const getCan = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);

    const candidates = exam.candidate.map(({ name, EID, score, _id }) => ({
      name,
      EID,
      score,
      id: _id,
    }));

    res.status(200).json(candidates.sort((a, b) => a.EID.localeCompare(b.EID)));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getExamByCode = async (req, res) => {
  try {
    const { examCode } = req.params;
    console.log(examCode);
    // const exam = await Exam.findOne({ examCode: examCode });
    // res.status(200).json(exam._id);

    const {
      _id,
      suspiciousTypingSpeed,
      suspiciousClipboardLength,
      suspiciousStandardDeviation,
      disallowedExtensions,
      language
    } = await Exam.findOne({ examCode: examCode });

    const token = jwt.sign({ id: _id }, process.env.JWT_PRIVATE_SECRET);

    res
      .status(200)
      .json({
        _id,
        suspiciousTypingSpeed,
        suspiciousClipboardLength,
        suspiciousStandardDeviation,
        disallowedExtensions,
        language,
        token
      });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCanDetail = async (req, res) => {
  try {
    const { examId, canId } = req.params;
    const exam = await Exam.findById(examId);

    const candidate = exam.candidate.find((e) => {
      return e._id == canId;
    });

    let index = 0;
    let acc = "";
    let historyFullLog = [];
    candidate.historyLog.map((file, fileIndex) => {
      acc = "";
      historyFullLog.push({ fileN: file.fileName, content: [""] });
      file.fileContent.map((item, timeCount) => {
        index = 0;
        item.map(({ count, value, added, removed }, x) => {
          if (removed) {
            acc = acc.slice(0, index);
            index += count;
            return;
          }
          if (added) {
            // acc = acc.slice(0, index) + value + acc.slice(index);
            acc = acc.slice(0, index) + value;
            index += count;
            return;
          }
          if (value) {
            index += count;
            return (acc = acc + value);
          }
          if (!value) {
            index += count;
            return;
          }
        });
        // timeCount++;
        if ((timeCount + 1) % process.env.TIME_COUNT === 0) {
          historyFullLog[fileIndex].content.push(acc);
          return;
        }
        if (timeCount === file.fileContent.length - 1) {
          historyFullLog[fileIndex].content.push(acc);
          return;
        }
      });
    });

    candidate.historyLog = historyFullLog;

    res.status(200).json(candidate);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addOrUpdateCan = async (req, res) => {
  try {
    const { examId } = req.params;
    // const examId = "63f75cba117a583c02115ca3";
    const candidate = req.body;

    // const candidate = new Candidate({
    //   name: "testCanName",
    //   EID: "testCanEID",
    //   historyLog: [1, 2, 3, 4, 5],
    //   clipboardLog: ["1", "2"],
    //   averageSpeed: 1,
    //   score: 1,
    //   extensionList: ["1e", "2e"],
    // });

    const exam = await Exam.findById(examId);

    exam.candidate.push(candidate);
    await exam.save();

    res.status(200).json("success");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateCan = async (req, res) => {
  try {
    const { examId, canId } = req.params;

    res.status(200).json();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

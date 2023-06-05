import User from "../models/User.js";
import Exam from "../models/Exam.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addExamHosted = async (req, res) => {
  try {
    const {
      userId,
      examCode,
      language,
      suspiciousTypingSpeed,
      suspiciousClipboardLength,
      suspiciousStandardDeviation,
      disallowedExtensions,
    } = req.body;
    const user = await User.findById(userId);
    const response = await Exam.findOne({ examCode: examCode }, "examCode");
    if (response) {
      return res.status(400).json({ message: "Exam already hosted " + response});
    }

    const newExam = new Exam({
      userId,
      username: user.username,
      examCode,
      candidate: [],
      language,
      suspiciousTypingSpeed,
      suspiciousClipboardLength,
      suspiciousStandardDeviation,
      disallowedExtensions,
    });
    await newExam.save();

    const exam = await Exam.find({ userId: userId });
    let result = exam.map(
      ({
        _id,
        userId,
        username,
        examCode,
        language,
        suspiciousTypingSpeed,
        suspiciousClipboardLength,
        suspiciousStandardDeviation,
        disallowedExtensions,
      }) => ({
        _id,
        userId,
        username,
        examCode,
        language,
        suspiciousTypingSpeed,
        suspiciousClipboardLength,
        suspiciousStandardDeviation,
        disallowedExtensions,
      })
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getExamHosted = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.find({ userId: id });
    let result = exam.map(
      ({
        _id,
        userId,
        username,
        examCode,
        language,
        suspiciousTypingSpeed,
        suspiciousClipboardLength,
        suspiciousStandardDeviation,
        disallowedExtensions,
      }) => ({
        _id,
        userId,
        username,
        examCode,
        language,
        suspiciousTypingSpeed,
        suspiciousClipboardLength,
        suspiciousStandardDeviation,
        disallowedExtensions,
      })
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteExamHosted = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByIdAndDelete(id);
    res.status(201).json("delete exam hosted");
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateExamHosted = async (req, res) => {
  try {
    const { id, examId } = req.params;
    const user = await User.findById(id);
    const exam = await Exam.findById(examId);

    if (!user.examHosted.includes(examId)) {
      user.examHosted.push(examId);
      exam.hostedBy.push(id);
    }

    await user.save();
    await exam.save();

    const updatedExamHosted = await Promise.all(
      user.examHosted.map((id) => Exam.findById(id))
    );

    res.status(200).json(updateExamHosted);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

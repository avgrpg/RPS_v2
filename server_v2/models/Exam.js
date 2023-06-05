import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    EID: {
      type: String,
      required: true,
    },
    historyLog: {
      type: Array,
      default: [],
    },
    clipboardLog: {
      type: Array,
      default: [],
    },
    averageSpeed: {
      type: Array,
      default: [],
    },
    score: Number,
    scoreBoard: Object,
    extensionList: Array,
    startTime: String,
    endTime: String,
    //
  },
  { timestamps: true } //automatically adds time stamp
);

const ExamSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    examCode: {
      type: String,
      required: true,
    },
    language: String,
    suspiciousTypingSpeed: Number,
    suspiciousClipboardLength: Number,
    suspiciousStandardDeviation: Number,
    disallowedExtensions: Array,
    candidate: [CandidateSchema],
    
  },
  { timestamps: true } //automatically adds time stamp
);

const Exam = mongoose.model("Exam", ExamSchema);
export default Exam;

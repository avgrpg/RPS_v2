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
    averageSpeed: Number,
    score: Number,
    extensionList: Array
    //
  },
  { timestamps: true } //automatically adds time stamp
);

const Candidate = mongoose.model("Candidate", CandidateSchema);

export default Candidate;
import express from "express";
import {
  getUser,
  getExamHosted,
  deleteExamHosted,
  updateExamHosted
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// read information about the user
// middleware provided for authorization
router.get("/:id", verifyToken, getUser);

router.get("/:id/exams",verifyToken, getExamHosted);
router.get("/delete/:id", deleteExamHosted);

// update 
router.patch("/:id/:examId", verifyToken, updateExamHosted);

export default router;
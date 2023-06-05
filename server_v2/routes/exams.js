import express from "express";
import { getCan, addOrUpdateCan, getCanDetail, getExamByCode } from "../controllers/exams.js";
import { getExamHosted } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getExamHosted);
router.get("/:examId", verifyToken, getCan);
router.get("/code/:examCode", getExamByCode);
router.get("/:examId/:canId",verifyToken, getCanDetail);


router.post("/:examId/addcan",verifyToken, addOrUpdateCan);

router.patch("/:examId/:canId", verifyToken, addOrUpdateCan);


export default router;


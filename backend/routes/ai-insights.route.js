import express, { Router } from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { generateRecommendation, generateChatResponse} from "../controllers/ai-insights.controller.js";

const router = express.Router();

// POST /api/ai-insights/generate
router.post('/generate', generateRecommendation);

// POST /api/ai-insights/chat
router.post('/chat', requireSignIn, generateChatResponse);

export default router;
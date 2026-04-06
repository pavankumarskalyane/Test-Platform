import express from 'express';
import { getTests, getTestById, createTest, deleteTest } from '../controllers/testController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTests)
    .post(protect, admin, createTest);

router.route('/:id')
    .get(protect, getTestById)
    .delete(protect, admin, deleteTest);

export default router;

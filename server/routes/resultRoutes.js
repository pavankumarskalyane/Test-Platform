import express from 'express';
import { submitTest, getMyResults, getTestResults, getAllResults } from '../controllers/resultController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, submitTest)
    .get(protect, admin, getAllResults);

router.route('/myresults')
    .get(protect, getMyResults);

router.route('/test/:testId')
    .get(protect, admin, getTestResults);

export default router;

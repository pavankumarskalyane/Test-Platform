import Result from '../models/Result.js';
import Test from '../models/Test.js';

// @desc    Submit a test result
// @route   POST /api/results
// @access  Private
export const submitTest = async (req, res) => {
    const { testId, answers } = req.body;

    try {
        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        let score = 0;
        const totalQuestions = test.questions.length;

        // Calculate score
        answers.forEach(answer => {
            const question = test.questions.id(answer.questionId);
            if (question) {
                const selectedOption = question.options[answer.selectedOptionIndex];
                if (selectedOption && selectedOption.isCorrect) {
                    score += 1;
                }
            }
        });

        const result = new Result({
            user: req.user._id,
            test: testId,
            score,
            totalQuestions,
            answers
        });

        const createdResult = await result.save();
        res.status(201).json(createdResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's results
// @route   GET /api/results/myresults
// @access  Private
export const getMyResults = async (req, res) => {
    try {
        const results = await Result.find({ user: req.user._id }).populate('test', 'title description');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all results for a specific test
// @route   GET /api/results/test/:testId
// @access  Private/Admin
export const getTestResults = async (req, res) => {
    try {
        const results = await Result.find({ test: req.params.testId }).populate('user', 'name email');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users' results (Admin)
// @route   GET /api/results
// @access  Private/Admin
export const getAllResults = async (req, res) => {
    try {
        const results = await Result.find({}).populate('user', 'name email').populate('test', 'title');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

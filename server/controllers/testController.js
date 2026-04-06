import Test from '../models/Test.js';

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
export const getTests = async (req, res) => {
    try {
        // Select only basic info, hide questions array for listing
        const tests = await Test.find({}).select('-questions');
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get test by ID (without correct answers)
// @route   GET /api/tests/:id
// @access  Private
export const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (test) {
            // Depending on if the request is from an admin or normal user,
            // we should technically strip 'isCorrect' from the options for normal users.
            
            if (req.user.role === 'admin') {
                res.json(test);
            } else {
                // Strip out isCorrect for users
                const sanitizedTest = test.toObject();
                sanitizedTest.questions = sanitizedTest.questions.map(q => {
                    q.options = q.options.map(opt => {
                        delete opt.isCorrect;
                        return opt;
                    });
                    return q;
                });
                res.json(sanitizedTest);
            }
        } else {
            res.status(404).json({ message: 'Test not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private/Admin
export const createTest = async (req, res) => {
    const { title, description, duration, questions } = req.body;

    try {
        const test = new Test({
            title,
            description,
            duration,
            questions,
            createdBy: req.user._id
        });

        const createdTest = await test.save();
        res.status(201).json(createdTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
export const deleteTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (test) {
            await test.deleteOne();
            res.json({ message: 'Test removed' });
        } else {
            res.status(404).json({ message: 'Test not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

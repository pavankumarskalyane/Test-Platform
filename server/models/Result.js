import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOptionIndex: { type: Number, required: true }
        }
    ],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

export default Result;

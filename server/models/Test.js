import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [
        {
            optionText: { type: String, required: true },
            isCorrect: { type: Boolean, required: true, default: false }
        }
    ]
});

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true, // in minutes
    },
    questions: [questionSchema], // Embedding questions entirely inside the test document
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);

export default Test;

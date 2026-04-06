import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: [{ optionText: '', isCorrect: true }, { optionText: '', isCorrect: false }] }
  ]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [{ optionText: '', isCorrect: true }, { optionText: '', isCorrect: false }] }]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].optionText = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach((opt, idx) => {
      opt.isCorrect = idx === oIndex;
    });
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tests', {
        title,
        description,
        duration: Number(duration),
        questions
      });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create test');
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Test</h2>
      </div>

      <div className="bg-white p-6 shadow sm:rounded-lg">
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input type="number" min="1" required value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Question {qIndex + 1}</label>
                  <input type="text" required value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                  <label className="block text-xs font-medium text-gray-500 uppercase">Options (Select the correct one)</label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name={`correct-${qIndex}`} 
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                      />
                      <input 
                        type="text" 
                        required 
                        value={opt.optionText} 
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                        className="p-1.5 block w-full border border-gray-300 rounded-md shadow-sm text-sm" 
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => handleAddOption(qIndex)} className="text-sm text-blue-600 hover:text-blue-500 mt-2">
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={handleAddQuestion} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition">
              + Add Another Question
            </button>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700">Save Test</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;

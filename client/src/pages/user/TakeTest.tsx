import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

interface Option {
  _id: string;
  optionText: string;
}

interface Question {
  _id: string;
  questionText: string;
  options: Option[];
}

interface TestData {
  _id: string;
  title: string;
  duration: number;
  questions: Question[];
}

const TakeTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selectedOptionIndex: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await api.get(`/tests/${testId}`);
        setTest(data);
        setTimeLeft(data.duration * 60);
      } catch (error) {
        console.error('Failed to load test', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSubmitting) {
      handleAutoSubmit();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isSubmitting]);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, selectedOptionIndex: optionIndex } : a));
      }
      return [...prev, { questionId, selectedOptionIndex: optionIndex }];
    });
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await submitTest();
  };

  const submitTest = async () => {
    try {
      const { data } = await api.post('/results', { testId, answers });
      navigate(`/results/${data._id}`, { replace: true });
    } catch (error) {
      console.error('Failed to submit test', error);
      alert('Error submitting test');
      setIsSubmitting(false); // only on failure we might unlock
    }
  };

  if (loading) return <div className="text-center py-10">Loading your test...</div>;
  if (!test) return <div className="text-center py-10">Test not found.</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-white shadow sticky md:top-4 z-10 p-4 rounded-lg border-l-4 border-blue-500 mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{test.title}</h2>
        <div className={`text-2xl font-bold ${timeLeft && timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
          {timeLeft !== null && formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-8">
        {test.questions.map((q, qIndex) => (
          <div key={q._id} className="bg-white p-6 shadow rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <span className="text-blue-500 mr-2">{qIndex + 1}.</span> 
              {q.questionText}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers.find(a => a.questionId === q._id)?.selectedOptionIndex === oIndex;
                return (
                  <label 
                    key={oIndex} 
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name={`question-${q._id}`} 
                        checked={isSelected}
                        onChange={() => handleSelectAnswer(q._id, oIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="ml-3 text-gray-700">{opt.optionText}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to finish and submit the test?')) {
              handleAutoSubmit();
            }
          }}
          disabled={isSubmitting}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
};

export default TakeTest;

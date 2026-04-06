import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const Result = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await api.get('/results/myresults');
        // Find the specific result
        const currentResult = data.find((r: any) => r._id === resultId);
        setResult(currentResult);
      } catch (error) {
        console.error('Failed to fetch result', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading) return <div className="text-center py-10">Loading your result...</div>;
  if (!result) return <div className="text-center py-10 font-medium text-red-500">Result not found.</div>;

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const passed = percentage >= 50;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 shadow-xl bg-white rounded-2xl border border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Test Completed</h2>
        <p className="text-lg text-gray-500 mb-8">{result.test?.title}</p>
        
        <div className="inline-flex justify-center items-center w-40 h-40 rounded-full border-8 mb-6 relative overflow-hidden" style={{
          borderColor: passed ? '#10B981' : '#EF4444',
          color: passed ? '#10B981' : '#EF4444'
        }}>
           <span className="text-4xl font-black">{percentage}%</span>
        </div>

        <h3 className={`text-2xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? 'Congratulations! You passed.' : 'Keep practicing! You failed.'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-8 text-left bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-500 font-medium">Total Questions:</div>
          <div className="font-bold text-gray-900 text-right">{result.totalQuestions}</div>
          <div className="text-gray-500 font-medium">Correct Answers:</div>
          <div className="font-bold text-gray-900 text-right">{result.score}</div>
          <div className="text-gray-500 font-medium">Submitted At:</div>
          <div className="font-bold text-gray-900 text-right text-sm">{new Date(result.completedAt).toLocaleString()}</div>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Result;

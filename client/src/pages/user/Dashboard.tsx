import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
}

const UserDashboard = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await api.get('/tests');
        setTests(data);
      } catch (error) {
        console.error('Failed to fetch tests', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return <div className="text-center py-10">Loading your tests...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-700">Available Tests</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests available at the moment.</p>
        ) : (
          tests.map((test) => (
            <div key={test._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">{test.title}</h4>
              <p className="text-gray-600 flex-grow mb-4">{test.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {test.duration} mins
                </span>
                <Link
                  to={`/test/${test._id}`}
                  className="inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Start Test
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

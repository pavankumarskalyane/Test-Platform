import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
}

const AdminDashboard = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await api.delete(`/tests/${id}`);
        setTests(tests.filter((t) => t._id !== id));
      } catch (error) {
        console.error('Failed to delete test', error);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading tests...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Link
          to="/admin/test/create"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Create New Test
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tests.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">No tests available. Create one!</li>
          ) : (
            tests.map((test) => (
              <li key={test._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-medium text-blue-600 truncate">{test.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{test.description}</p>
                    <p className="mt-1 text-xs text-gray-400">Duration: {test.duration} minutes</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="text-red-600 hover:text-red-900 font-medium text-sm"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/admin/results/${test._id}`}
                      className="text-green-600 hover:text-green-900 font-medium text-sm"
                    >
                      View Results
                    </Link>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

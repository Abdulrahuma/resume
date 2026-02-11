import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI Resume ATS Analyzer</h1>
        <p className="text-gray-600">
          Optimize your resume for Applicant Tracking Systems
        </p>

        <Link
          to="/analyze"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Analyze Resume
        </Link>
      </div>
    </div>
  );
};

export default Home;

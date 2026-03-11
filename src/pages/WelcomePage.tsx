import { Link } from 'react-router';

function WelcomePage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-5xl text-blue-600">Welcome to JobChaser</h1>
      <Link
        to="/jobs"
        className="m-4 cursor-pointer rounded-2xl border p-2 hover:bg-slate-200"
      >
        To Jobs
      </Link>
    </div>
  );
}

export default WelcomePage;

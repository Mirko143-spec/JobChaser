import { Link } from 'react-router';
function NotFoundPage() {
  return (
    <div className="p-4 text-center">
      <h2 className="mb-4 text-3xl font-bold">404 - Page Not Found</h2>
      <Link to="/jobs" className="text-blue-500 hover:underline">
        Go back to Jobs
      </Link>
    </div>
  );
}
export default NotFoundPage;

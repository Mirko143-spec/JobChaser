import { createBrowserRouter } from 'react-router';
import App from './App';
import JobsPage from './pages/JobsPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import NotFoundPage from './pages/NotFoundPage';
import WelcomePage from './pages/WelcomePage';
import SavedJobsPage from './pages/SavedJobsPage';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: 'jobs', element: <JobsPage /> },
      {
        path: 'saved',
        element: (
          <ProtectedRoute>
            <SavedJobsPage />
          </ProtectedRoute>
        ),
      },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;

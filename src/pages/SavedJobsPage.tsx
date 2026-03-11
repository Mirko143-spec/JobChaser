import { useEffect, useState } from 'react';
import { useAuthStore, API_URL } from '../stores/authStore';
import { useNavigate } from 'react-router';
import Modal from '../components/Modal';
import JobDesc from '../components/JobDesc';

interface SavedJob {
  id: number;
  externalJobId: string | null;
  company: string;
  logo: string | null;
  position: string;
  role: string | null;
  level: string | null;
  postedAt: string | null;
  contract: string | null;
}

interface FullJobDetails {
  company: string;
  logo: string;
  position: string;
  description: string;
  employmentType: string;
  workingHours: string;
  location: string;
  benefits: string;
  salary: string;
  link: string;
}

function SavedJobsPage() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] =
    useState<FullJobDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/jobs`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved jobs');
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [isAuthenticated]);

  const fetchJobDetails = async (externalJobId: string) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(
        `https://jobsearch.api.jobtechdev.se/search?q=${externalJobId}&offset=0&limit=1`
      );

      if (!res.ok) {
        throw new Error(`HTTP: ${res.status}`);
      }

      const apiData = await res.json();
      const job = apiData.hits[0];

      if (job) {
        const link =
          job.application_url ||
          job.webpage_url ||
          `https://arbetsformedlingen.se/platsbanken/annonser/${externalJobId}`;
        const details: FullJobDetails = {
          company: job.employer?.name || 'Okänt företag',
          logo: job.logo_url || './assets/default-logo.svg',
          position: job.headline,
          description: job.description?.text || 'Ingen beskrivning',
          employmentType: job.employment_type?.label || 'Ej specificerat',
          workingHours: job.working_hours_type?.label || 'Ej specificerat',
          location: job.workplace_address?.municipality || 'Okänd ort',
          benefits:
            job.description?.conditions?.replace(/\r\n/g, '\n') ||
            'Inga förmåner specificerade',
          salary:
            job.salary_description ||
            job.salary_type?.label ||
            'Ej specificerat',
          link,
        };
        setSelectedJobDetails(details);
      }
    } catch (err) {
      console.error('Failed to fetch job details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleJobClick = (job: SavedJob) => {
    if (job.externalJobId) {
      fetchJobDetails(job.externalJobId);
    }
  };

  const handleCloseModal = () => {
    setSelectedJobDetails(null);
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading saved jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center overflow-y-auto bg-white px-4 pt-8 pb-4 dark:bg-gray-900">
      <h1 className="mt-8 mb-6 text-3xl font-bold text-blue-600 dark:text-blue-400">
        Saved Jobs
      </h1>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          <p className="mb-4">You haven't saved any jobs yet.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="mx-auto flex w-lg max-w-md cursor-pointer flex-row items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
              >
                <div className="flex-1">
                  <h3 className="mb-1 text-lg text-gray-700 dark:text-gray-200">
                    {job.position}
                  </h3>
                  <ul className="mb-1.5">
                    <li className="text-gray-700 dark:text-gray-200">
                      {job.level || 'N/A'}
                    </li>
                    <li className="text-gray-700 dark:text-gray-200">
                      {job.contract || 'N/A'}
                    </li>
                  </ul>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {job.postedAt} by {job.company}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="h-20 w-20 object-contain"
                    />
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteJob(job.id);
                    }}
                    className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Modal
            isOpen={!!selectedJobDetails || loadingDetails}
            onClose={handleCloseModal}
          >
            {loadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-lg">Laddar...</div>
              </div>
            ) : selectedJobDetails ? (
              <JobDesc
                company={selectedJobDetails.company}
                logo={selectedJobDetails.logo}
                position={selectedJobDetails.position}
                description={selectedJobDetails.description}
                employmentType={selectedJobDetails.employmentType}
                workingHours={selectedJobDetails.workingHours}
                location={selectedJobDetails.location}
                benefits={selectedJobDetails.benefits}
                salary={selectedJobDetails.salary}
                link={selectedJobDetails.link}
              />
            ) : null}
          </Modal>
        </>
      )}
    </div>
  );
}

export default SavedJobsPage;

import { useEffect, useState, useMemo } from 'react';
import JobItem from './JobItem';
import JobDesc from './JobDesc';
import { useAuthStore, API_URL } from '../stores/authStore';
import { useFilterStore } from '../stores/filterStore';

interface Job {
  id: number;
  company: string;
  logo: string;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
  description: string;
  employmentType: string;
  workingHours: string;
  benefits: string;
  salary: string;
  link: string;
}

interface ApiJob {
  id: string;
  headline: string;
  description?: {
    text: string;
    conditions?: string;
  };
  employer?: {
    name: string;
  };
  occupation?: {
    label: string;
  };
  workplace_address?: {
    municipality: string;
  };
  publication_date: string;
  employment_type?: {
    label: string;
  };
  working_hours_type?: {
    label: string;
  };
  salary_type?: {
    label: string;
  };
  salary_description?: string;
  duration?: {
    label: string;
  };
  logo_url: string | null;
  must_have?: {
    skills: { label: string }[];
    languages: { label: string }[];
  };
  experience_required: boolean;
  application_url?: string;
  webpage_url?: string;
}

function JobList({ search = '' }: { search?: string }) {
  const [jobData, setJobData] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { location, category, level, employmentType } = useFilterStore();

  const filteredJobs = useMemo(() => {
    return jobData.filter(job => {
      const matchesLocation =
        !location ||
        job.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory =
        !category || job.role.toLowerCase().includes(category.toLowerCase());
      const matchesLevel = !level || job.level === level;
      const matchesEmployment =
        !employmentType ||
        job.employmentType.toLowerCase().includes(employmentType.toLowerCase());

      return (
        matchesLocation && matchesCategory && matchesLevel && matchesEmployment
      );
    });
  }, [jobData, location, category, level, employmentType]);

  const selectedJob = jobData.find(job => job.id === selectedJobId);

  function mapApiJob(apiJob: ApiJob): Job {
    const link =
      apiJob.application_url ||
      apiJob.webpage_url ||
      `https://arbetsformedlingen.se/platsbanken/annonser/${apiJob.id}`;
    return {
      id: Number(apiJob.id),
      company: apiJob.employer?.name || 'Okänt företag',
      logo: apiJob.logo_url || './assets/default-logo.svg',
      position: apiJob.headline,
      role: apiJob.occupation?.label || 'Okänd roll',
      level: apiJob.experience_required ? 'Erfaren' : 'Junior',
      postedAt: new Date(apiJob.publication_date).toLocaleDateString('sv-SE'),
      contract: `${apiJob.employment_type?.label || ''} - ${apiJob.duration?.label || ''}`,
      location: apiJob.workplace_address?.municipality || 'Okänd ort',
      languages: apiJob.must_have?.languages?.map(l => l.label) || [],
      tools: apiJob.must_have?.skills?.map(s => s.label) || [],
      description: apiJob.description?.text || 'Ingen beskrivning',
      employmentType: apiJob.employment_type?.label || 'Ej specificerat',
      workingHours: apiJob.working_hours_type?.label || 'Ej specificerat',
      benefits:
        apiJob.description?.conditions?.replace(/\r\n/g, '\n') ||
        'Inga förmåner specificerade',
      salary:
        apiJob.salary_description ||
        apiJob.salary_type?.label ||
        'Ej specificerat',
      link,
    };
  }

  useEffect(() => {
    setSelectedJobId(null);
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://jobsearch.api.jobtechdev.se/search?q=${search}&offset=0&limit=20&sort=pubdate-desc`
        );

        if (!res.ok) {
          throw new Error(`HTTP: ${res.status} `);
        }

        const apiData = await res.json();
        const data = apiData.hits.map(mapApiJob);

        setTimeout(() => {
          setJobData(data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occured';
        setTimeout(() => {
          setError(errorMessage);
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [search]);

  useEffect(() => {
    if (selectedJobId) {
      setShowContent(false);
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedJobId]);

  const handleSaveJob = async (job: Job) => {
    if (!isAuthenticated) {
      setSaveMessage('Please sign in to save jobs');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          externalJobId: String(job.id),
          company: job.company,
          logo: job.logo,
          position: job.position,
          role: job.role,
          level: job.level,
          postedAt: job.postedAt,
          contract: job.contract,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      setSavedJobs(prev => new Set(prev).add(job.id));
      setSaveMessage('Job saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Failed to save job');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="relative flex min-w-5xl overflow-hidden rounded p-6 shadow-[0_0_15px_rgba(0,0,0,0.15)]">
      {saveMessage && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-green-500 px-4 py-2 text-white">
          {saveMessage}
        </div>
      )}
      <div className="flex h-200 min-w-120 flex-col items-center overflow-y-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          filteredJobs.map(job => (
            <JobItem
              key={job.id}
              id={job.id}
              company={job.company}
              logo={job.logo}
              position={job.position}
              role={job.role}
              level={job.level}
              postedAt={job.postedAt}
              contract={job.contract}
              location={job.location}
              languages={job.languages}
              tools={job.tools}
              onClick={() => setSelectedJobId(job.id)}
              onSave={() => handleSaveJob(job)}
              isSaved={savedJobs.has(job.id)}
            />
          ))
        )}
      </div>
      <div
        className={`ml-8 h-200 max-w-123 min-w-120 transform self-start overflow-y-scroll rounded border border-gray-200 bg-white p-6 transition-all duration-300 ease-out dark:border-gray-700 dark:bg-gray-800 ${
          selectedJobId
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-full opacity-0'
        }`}
      >
        {showContent && selectedJob ? (
          <JobDesc
            company={selectedJob.company}
            logo={selectedJob.logo}
            position={selectedJob.position}
            description={selectedJob.description}
            employmentType={selectedJob.employmentType}
            workingHours={selectedJob.workingHours}
            location={selectedJob.location}
            benefits={selectedJob.benefits}
            salary={selectedJob.salary}
            link={`https://jobsearch.se/job/${selectedJob.id}`}
          />
        ) : (
          <div className="h-full min-w-123" />
        )}
      </div>
    </div>
  );
}

export default JobList;

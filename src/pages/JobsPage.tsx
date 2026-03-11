import { useState } from 'react';
import JobChaser from '../components/JobChaser';
import JobList from '../components/JobList';
import FilterPanel from '../components/FilterPanel';
function JobsPage() {
  const [search, setSearch] = useState<string | undefined>('');

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-4">
      <JobChaser setSearch={setSearch} />
      <FilterPanel />
      <JobList search={search} />
    </div>
  );
}
export default JobsPage;

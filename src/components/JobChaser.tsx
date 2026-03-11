import { useState, useEffect } from 'react';

interface JobChaserProps {
  setSearch: (searchTerm: string) => void;
}

function JobChaser({ setSearch }: JobChaserProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, setSearch]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <main className="mx-auto min-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-blue-600 dark:text-blue-400">
            Jobchaser
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find your dream job
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div className="text-center">
            <p>Please Search or select a job</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default JobChaser;

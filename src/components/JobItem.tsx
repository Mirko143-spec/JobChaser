import { useAuthStore } from '../stores/authStore';

interface JobItemProps {
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
  onClick: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

function JobItem({
  company,
  logo,
  position,
  role,
  level,
  postedAt,
  contract,
  onClick,
  onSave,
  isSaved = false,
}: JobItemProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="mx-auto mb-4 flex h-fit">
      <div
        onClick={onClick}
        className="flex w-lg max-w-md cursor-pointer flex-row items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex-1">
          <header>
            <h2 className="mb-1 text-lg text-gray-700 dark:text-gray-200">
              {position} | {role}
            </h2>
            <ul className="mb-1.5">
              <li className="text-gray-700 dark:text-gray-200">{level}</li>
              <li className="text-gray-700 dark:text-gray-200">{contract}</li>
            </ul>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {postedAt} by {company}
            </p>
          </header>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="Photo" className="h-20 w-20 object-contain" />
          {isAuthenticated && onSave && (
            <button
              onClick={handleSaveClick}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                isSaved
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={isSaved}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobItem;

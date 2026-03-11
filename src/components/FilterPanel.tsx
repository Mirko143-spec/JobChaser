import { useFilterStore } from '../stores/filterStore';

function FilterPanel() {
  const {
    location,
    category,
    level,
    employmentType,
    setLocation,
    setCategory,
    setLevel,
    setEmploymentType,
    clearFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Ort
        </label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="t.ex. Stockholm"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Kategori
        </label>
        <input
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="t.ex. IT"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Nivå
        </label>
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Alla</option>
          <option value="Junior">Junior</option>
          <option value="Erfaren">Erfaren</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Anställning
        </label>
        <input
          type="text"
          value={employmentType}
          onChange={e => setEmploymentType(e.target.value)}
          placeholder="t.ex. Heltid"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex items-end">
        <button
          onClick={clearFilters}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Rensa ({activeFilterCount})
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;

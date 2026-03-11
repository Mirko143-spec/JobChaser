interface JobDescProps {
  company: string;
  logo: string;
  position: string;
  description: string;
  employmentType: string;
  workingHours: string;
  location: string;
  benefits: string;
  salary: string;
  link?: string;
}

function JobDesc({
  company,
  logo,
  position,
  description,
  employmentType,
  workingHours,
  location,
  benefits,
  salary,
  link,
}: JobDescProps) {
  return (
    <div className="space-y-4 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {company}
          </h2>
          <h3 className="text-lg text-gray-600 dark:text-gray-400">
            {position}
          </h3>
        </div>
        <img
          src={logo}
          alt={`${company} logo`}
          className="h-16 w-16 rounded bg-white object-contain dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Anställningsform
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{employmentType}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Arbetstid
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{workingHours}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Ort
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{location}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Lön
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{salary}</p>
        </div>
      </div>
      {benefits !== 'Inga förmåner specificerade' && (
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Förmåner
          </h3>
          <p className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
            {benefits}
          </p>
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Beskrivning
        </h3>
        <p className="text-[0.85rem] leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      {link && (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Läs mer på arbetsgivarens hemsida
          </a>
        </div>
      )}
    </div>
  );
}

export default JobDesc;

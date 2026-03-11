import { create } from 'zustand';

interface FilterState {
  location: string;
  category: string;
  level: string;
  employmentType: string;
  setLocation: (location: string) => void;
  setCategory: (category: string) => void;
  setLevel: (level: string) => void;
  setEmploymentType: (type: string) => void;
  clearFilters: () => void;
  getActiveFilterCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  location: '',
  category: '',
  level: '',
  employmentType: '',

  setLocation: (location: string) => set({ location }),
  setCategory: (category: string) => set({ category }),
  setLevel: (level: string) => set({ level }),
  setEmploymentType: (type: string) => set({ employmentType: type }),

  clearFilters: () =>
    set({
      location: '',
      category: '',
      level: '',
      employmentType: '',
    }),

  getActiveFilterCount: () => {
    const { location, category, level, employmentType } = get();
    let count = 0;
    if (location) count++;
    if (category) count++;
    if (level) count++;
    if (employmentType) count++;
    return count;
  },
}));

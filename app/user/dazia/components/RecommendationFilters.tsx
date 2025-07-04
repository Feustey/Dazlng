import { motion } from 'framer-motion';

import { useState } from 'react';
import { Search, Filter, X } from '@/components/shared/ui/IconRegistry';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface RecommendationFiltersProps {
  onFilterChange: (filters: {
  search: string;
  categories: string[];
  impact: string[];
  difficulty: string[];
}) => void;
}

export const RecommendationFilters = ({ onFilterChange }: RecommendationFiltersProps) => {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImpact, setSelectedImpact] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const categories: FilterOption[] = [
    { id: 'liquidity', label: "user.useruserliquidit", value: 'liquidity' },
    { id: 'connectivity', label: "user.useruserconnectivit", value: 'connectivity' },
    { id: 'fees', label: 'Frais', value: 'fees' },
    { id: 'security', label: "user.useruserscurit", value: 'security' }
  ];

  const impactLevels: FilterOption[] = [
    { id: 'high', label: "user.useruserlev", value: 'high' },
    { id: 'medium', label: 'Moyen', value: 'medium' },
    { id: 'low', label: 'Faible', value: 'low' }
  ];

  const difficultyLevels: FilterOption[] = [
    { id: 'easy', label: 'Facile', value: 'easy' },
    { id: 'medium', label: 'Moyen', value: 'medium' },
    { id: 'hard', label: 'Difficile', value: 'hard' }
  ];

  const handleFilterChange = () => {
    onFilterChange({
      search,
      categories: selectedCategories,
      impact: selectedImpact,
      difficulty: selectedDifficulty
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
  );
  };

  const toggleImpact = (impact: string) => {
    setSelectedImpact(prev =>
      prev.includes(impact)
        ? prev.filter(i => i !== impact)
        : [...prev, impact]
  );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
  );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedImpact([]);
    setSelectedDifficulty([]);
    onFilterChange({
      search: '',
      categories: [],
      impact: [],
      difficulty: []
    });
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? 'Réduire' : 'Développer'}
        </button>
      </div>

      <div className="mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e: any) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            placeholder="user.useruserrechercher_une_recomma"
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="mt-4 space-y-4">
          {/* Catégories */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">{t('user.catgories')}</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => {
                    toggleCategory(category.value);
                    handleFilterChange();
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedCategories.includes(category.value)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Impact</h4>
            <div className="flex flex-wrap gap-2">
              {impactLevels.map((impact: any) => (
                <button
                  key={impact.id}
                  onClick={() => {
                    toggleImpact(impact.value);
                    handleFilterChange();
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedImpact.includes(impact.value)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {impact.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">{t('user.difficult')}</h4>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels.map((difficulty: any) => (
                <button
                  key={difficulty.id}
                  onClick={() => {
                    toggleDifficulty(difficulty.value);
                    handleFilterChange();
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    selectedDifficulty.includes(difficulty.value)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {(search || selectedCategories.length > 0 || selectedImpact.length > 0 || selectedDifficulty.length > 0) && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              {selectedCategories.length + selectedImpact.length + selectedDifficulty.length} filtres actifs
            </span>
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            <span>{t('user.effacer_les_filtres')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";

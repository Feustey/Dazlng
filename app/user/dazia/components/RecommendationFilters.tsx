import { motion } from "framer-motion";
import { useState } from "react";
import {Search, Filter, X} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

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
  const { t } = useAdvancedTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImpact, setSelectedImpact] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const categories: FilterOption[] = [
    { id: "liquidity", label: "Liquidité", value: "liquidity" },
    { id: "connectivity", label: "Connectivité", value: "connectivity" },
    { id: "fees", label: "Frais", value: "fees" },
    { id: "security", label: "Sécurité", value: "security" }
  ];

  const impactLevels: FilterOption[] = [
    { id: "high", label: "Élevé", value: "high" },
    { id: "medium", label: "Moyen", value: "medium" },
    { id: "low", label: "Faible", value: "low" }
  ];

  const difficultyLevels: FilterOption[] = [
    { id: "easy", label: "Facile", value: "easy" },
    { id: "medium", label: "Moyen", value: "medium" },
    { id: "hard", label: "Difficile", value: "hard" }
  ];

  const handleFilterChange = () => {
    onFilterChange({
      search,
      categories: selectedCategories,
      impact: selectedImpact,
      difficulty: selectedDifficulty
    });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleImpact = (impactId: string) => {
    setSelectedImpact(prev => 
      prev.includes(impactId) 
        ? prev.filter(id => id !== impactId)
        : [...prev, impactId]
    );
  };

  const toggleDifficulty = (difficultyId: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(difficultyId) 
        ? prev.filter(id => id !== difficultyId)
        : [...prev, difficultyId]
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedImpact([]);
    setSelectedDifficulty([]);
    handleFilterChange();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtres
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          {isExpanded ? "Réduire" : "Étendre"}
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterChange();
          }}
          placeholder="Rechercher des recommandations..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
        />
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Catégories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Catégories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Impact</h4>
            <div className="flex flex-wrap gap-2">
              {impactLevels.map((impact) => (
                <button
                  key={impact.id}
                  onClick={() => toggleImpact(impact.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedImpact.includes(impact.id)
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {impact.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulté</h4>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => toggleDifficulty(difficulty.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedDifficulty.includes(difficulty.id)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton pour vider les filtres */}
          {(selectedCategories.length > 0 || selectedImpact.length > 0 || selectedDifficulty.length > 0 || search) && (
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                Vider tous les filtres
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
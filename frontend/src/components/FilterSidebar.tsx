import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";

interface FilterSidebarProps {
  categories: string[];
  selectedCategories: string[];
  handleCategoryChange: (category: string) => void;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  setPriceRange: (value: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  minPrice,
  maxPrice,
  setPriceRange,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg shadow"
        />
      </div>
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-300"
              />
              <span className="text-gray-800">{category}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold mb-2">Price Range</h3>
        <PriceRangeSlider
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;

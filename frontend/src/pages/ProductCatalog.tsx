import React, { useState } from "react";
import products from "../data/products.json";
import ProductCard from "../components/ProductCard";

const ProductCatalog: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [...new Set(products.map((product) => product.category))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category) // Remove category if already selected
          : [...prev, category] // Add category if not selected
    );
  };

  const minPrice = Math.min(...products.map((product) => product.price));
  const maxPrice = Math.max(...products.map((product) => product.price));

  // Filter products based on selected categories
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">
        Product Catalog
      </h1>
      <div className="product-catalog py-5 px-2 flex flex-col md:flex-row">
        {/* Sidebar for Categories */}
        <div
          className={`w-full md:w-1/5 px-2 mr-4 ${
            isFilterOpen ? "block" : "hidden md:block"
          }`}
        >
          <h2 className="text-lg font-bold mb-2 flex justify-between items-center">
            Filter by Categories
            <button
              className="md:hidden text-sm text-blue-500 underline"
              onClick={() => setIsFilterOpen(false)}
            >
              Close
            </button>
          </h2>
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
          </div>
          <div className="flex flex-col space-y-2 mb-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
          {/* Price Range Slider*/}
          <div>
            <h3 className="text-md font-semibold mb-2">Price Range</h3>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-full"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full"
            />
          </div>
        </div>

        {!isFilterOpen && (
          <button
            className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
            onClick={() => setIsFilterOpen(true)}
          >
            Open Filters
          </button>
        )}

        {/* Product Grid */}
        <div className="w-full md:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <p>No products found for the selected categories.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCatalog;

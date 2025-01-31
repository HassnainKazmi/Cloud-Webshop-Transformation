import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import products from "../data/products.json";
import ProductCard from "../components/ProductCard";

const ProductCatalog: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories from the product data
  const categories = [...new Set(products.map((product) => product.category))];

  // Ensure we have products before calculating min/max prices
  const minPrice = products.length
    ? Math.min(...products.map((p) => p.price))
    : 0;
  const maxPrice = products.length
    ? Math.max(...products.map((p) => p.price))
    : 100;

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  // Filter products based on search, categories, and price range
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      priceRange &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">
        Product Catalog
      </h1>

      <div className="product-catalog py-5 px-2 flex flex-col md:flex-row">
        {/* Sidebar for Filters */}
        <div
          className={`w-full md:w-1/5 p-2 ${
            isFilterOpen ? "block" : "hidden md:block"
          } sticky top-0`}
        >
          <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
            Filters
            <button
              className="md:hidden text-sm text-blue-500 underline"
              onClick={() => setIsFilterOpen(false)}
            >
              Close
            </button>
          </h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Categories</h3>
            <div className="flex flex-col space-y-2">
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
          </div>

          {/* Price Range Slider */}
          {priceRange && (
            <div className="mr-1">
              <h3 className="text-md font-semibold mb-2">Price Range</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>${priceRange[0].toFixed(2)}</span>
                <span>${priceRange[1].toFixed(2)}</span>
              </div>
              <Range
                step={1}
                min={minPrice}
                max={maxPrice}
                values={priceRange}
                onChange={(values: number[]) =>
                  setPriceRange([values[0], values[1]])
                }
                renderTrack={({ props, children }) => {
                  return (
                    <div
                      {...props}
                      style={{
                        height: "6px",
                        width: "100%",
                        background: getTrackBackground({
                          values: priceRange,
                          colors: ["#d3d3d3", "#007bff", "#d3d3d3"],
                          min: minPrice,
                          max: maxPrice,
                        }),
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => (
                  <div {...props}>
                    <div
                      style={{
                        position: "absolute",
                        top: "-7px",
                        left: "-4px",
                        fontWeight: "bold",
                        fontSize: "12px",
                        background: "#000",
                        padding: "6px",
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="w-full mx-2 md:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p>No products found for the selected filters.</p>
          )}
        </div>

        {/* Toggle Filter Button for Small Screens */}
        {!isFilterOpen && (
          <button
            className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
            onClick={() => setIsFilterOpen(true)}
          >
            Open Filters
          </button>
        )}
      </div>
    </>
  );
};

export default ProductCatalog;

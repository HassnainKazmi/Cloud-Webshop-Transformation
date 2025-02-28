import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import ProductType from "../types/types";

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(
          "https://cloud-webshop-backend-gxhqcxhmguc7brg0.germanywestcentral-01.azurewebsites.net/api/products/"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const categories = [...new Set(products.map((product) => product.category.name))];
  const minPrice = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 100;

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category.name);

    const matchesPrice =
      priceRange && product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto my-10 px-4 py-6">
      <h1 className="text-2xl font-bold text-center my-6">Product Catalog</h1>
      {loading && (
        <div className="relative w-full h-1 bg-gray-200 overflow-hidden mb-4">
          <div className="absolute inset-0 w-full h-full bg-blue-600 animate-pulse"></div>
        </div>
      )}
      <button
        className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => setIsFilterOpen(true)}
      >
        Open Filters
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div
          className={`fixed inset-0 bg-white z-50 md:relative md:bg-transparent md:z-auto transition-transform duration-300 ease-in-out transform ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } md:w-1/4 w-full shadow-lg md:shadow-none`}
        >
          <div className="flex justify-between items-center p-4 md:hidden">
            <button
              className="text-gray-600 hover:text-gray-900 ml-auto"
              onClick={() => setIsFilterOpen(false)}
            >
              ✕
            </button>
          </div>
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            priceRange={priceRange as [number, number]}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setPriceRange={setPriceRange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="w-full md:w-3/4">
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                  alt="No products found"
                  className="w-32 h-32 mx-auto mb-6 opacity-70"
                />
                <h2 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria to find the perfect product.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setPriceRange([minPrice, maxPrice]);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;

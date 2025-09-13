import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 bg-white rounded-lg shadow-lg border border-gray-200 mb-5">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5">
        Search results for <b className="text-primary-color">{searchParams.get("city")}</b>
      </h1>
      <div className="mb-3 sm:mb-4 md:mb-5">
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="city" className="text-xs sm:text-sm font-semibold text-gray-700">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore...)"
            onChange={handleChange}
            defaultValue={query.city}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-lg focus:shadow-primary-color/10 placeholder:text-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 items-end">
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="type" className="text-xs sm:text-sm font-semibold text-gray-700">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
            className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm md:text-base bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-lg focus:shadow-primary-color/10 cursor-pointer appearance-none"
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="property" className="text-xs sm:text-sm font-semibold text-gray-700">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
            className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm md:text-base bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-lg focus:shadow-primary-color/10 cursor-pointer appearance-none"
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="minPrice" className="text-xs sm:text-sm font-semibold text-gray-700">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
            className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm md:text-base bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-lg focus:shadow-primary-color/10 placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="maxPrice" className="text-xs sm:text-sm font-semibold text-gray-700">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
            className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm md:text-base bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-lg focus:shadow-primary-color/10 placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label htmlFor="bedroom" className="text-xs sm:text-sm font-semibold text-gray-700">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
            className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm md:text-base bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:border-primary-color focus:shadow-lg focus:shadow-primary-color/10 placeholder:text-gray-400"
          />
        </div>
        <button 
          onClick={handleFilter}
          className="bg-primary-color text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm md:text-base"
        >
          <img src="/search.png" alt="" className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
}

export default Filter;
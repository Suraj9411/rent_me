import { useState } from "react";
import { Link } from "react-router-dom";

const types = ["rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "rent",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex gap-2 mb-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              query.type === type 
                ? "bg-indigo-600 text-white shadow-lg" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <form className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="flex-shrink-0"
        >
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <img src="/search.png" alt="Search" className="w-6 h-6" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;

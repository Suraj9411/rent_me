import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function AboutPage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-4xl sm:text-3xl font-bold text-white mb-5 drop-shadow-lg">
            About RentEase
          </h1>
          <p className="text-xl md:text-lg text-white/90 leading-relaxed">
            Your trusted partner in finding the perfect rental property
          </p>
        </div>
      </div>

      {/* Vision Section */}
      <div className="py-20 px-5">
        <div className="w-4/5 max-w-6xl mx-auto lg:w-11/12 md:w-11/12 sm:w-11/12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To revolutionize the rental property market by creating a seamless, 
                transparent, and user-friendly platform that connects property owners 
                with tenants, making the process of finding and renting properties 
                as simple as possible.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a world where everyone can find their perfect home 
                without the hassle of traditional property hunting, where technology 
                bridges the gap between supply and demand in the rental market.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <img src="/home1.jpg" alt="Modern apartment building" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-5 bg-white">
        <div className="w-4/5 max-w-6xl mx-auto lg:w-11/12 md:w-11/12 sm:w-11/12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/home3.jpg" alt="Happy family in their new home" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
            </div>
            <div>
              <h2 className="text-4xl md:text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To provide a comprehensive rental platform that offers:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <span className="text-gray-600">Easy property discovery with advanced search and filtering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <span className="text-gray-600">Transparent pricing and detailed property information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <span className="text-gray-600">Secure communication between tenants and property owners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <span className="text-gray-600">User-friendly interface for both mobile and desktop users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <span className="text-gray-600">Real-time updates and notifications</span>
                </li>
              </ul>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're committed to making the rental process efficient, 
                transparent, and enjoyable for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 px-5">
        <div className="w-4/5 max-w-6xl mx-auto lg:w-11/12 md:w-11/12 sm:w-11/12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                RentEase was born from a simple observation: finding a rental 
                property shouldn't be complicated. Our founders experienced the 
                frustration of traditional property hunting firsthand and decided 
                to create a solution.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Starting as a small startup in 2023, we've grown into a trusted 
                platform serving thousands of users across the country. Our journey 
                has been driven by user feedback and the constant desire to improve 
                the rental experience.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we're proud to offer a platform that not only helps people 
                find homes but also builds communities by connecting property owners 
                with responsible tenants.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <img src="/home5.jpg" alt="Team collaboration" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 px-5 bg-white">
        <div className="w-4/5 max-w-6xl mx-auto lg:w-11/12 md:w-11/12 sm:w-11/12">
          <h2 className="text-4xl md:text-3xl font-bold text-gray-800 text-center mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="text-5xl mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trust</h3>
              <p className="text-gray-600 leading-relaxed">Building reliable relationships between property owners and tenants</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Efficiency</h3>
              <p className="text-gray-600 leading-relaxed">Streamlining the rental process to save time and effort</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Security</h3>
              <p className="text-gray-600 leading-relaxed">Ensuring safe and secure transactions and communications</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="text-5xl mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">Continuously improving our platform with cutting-edge technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-5 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="w-4/5 max-w-6xl mx-auto lg:w-11/12 md:w-11/12 sm:w-11/12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-5xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-xl text-white/90">Properties Listed</div>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-xl text-white/90">Happy Tenants</div>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl md:text-4xl font-bold mb-2">200+</div>
              <div className="text-xl text-white/90">Property Owners</div>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-xl text-white/90">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-5">
        <div className="w-4/5 max-w-4xl mx-auto lg:w-11/12 md:w-11/12 sm:w-11/12 text-center">
          <h2 className="text-4xl md:text-3xl font-bold text-gray-800 mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl text-gray-600 mb-10">Join thousands of satisfied users who have found their ideal rental property</p>
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300">
                Get Started
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                Learn More
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300">
                Browse Properties
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

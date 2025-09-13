import { useState } from "react";

function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

  // Mock agents data
  const agents = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "/home1.jpg",
      specialty: "residential",
      experience: "8 years",
      rating: 4.9,
      properties: 45,
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@rentease.com",
      description: "Specialized in residential properties with a focus on family homes and apartments. Known for excellent client relationships and market knowledge.",
      languages: ["English", "Spanish"],
      certifications: ["Licensed Real Estate Agent", "Certified Property Manager"]
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "/home3.jpg",
      specialty: "commercial",
      experience: "12 years",
      rating: 4.8,
      properties: 32,
      phone: "+1 (555) 234-5678",
      email: "michael.chen@rentease.com",
      description: "Expert in commercial real estate including office spaces, retail properties, and industrial facilities. Strong negotiation skills.",
      languages: ["English", "Mandarin"],
      certifications: ["Commercial Real Estate Specialist", "Investment Property Advisor"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "/home5.jpg",
      specialty: "luxury",
      experience: "15 years",
      rating: 5.0,
      properties: 28,
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@rentease.com",
      description: "Luxury property specialist with extensive experience in high-end residential and vacation properties. Discreet and professional service.",
      languages: ["English", "French", "Spanish"],
      certifications: ["Luxury Property Specialist", "International Real Estate"]
    },
    {
      id: 4,
      name: "David Thompson",
      image: "/home1.jpg",
      specialty: "residential",
      experience: "6 years",
      rating: 4.7,
      properties: 38,
      phone: "+1 (555) 456-7890",
      email: "david.thompson@rentease.com",
      description: "Young and energetic agent specializing in first-time homebuyers and investment properties. Great at explaining the process to newcomers.",
      languages: ["English"],
      certifications: ["First-Time Homebuyer Specialist", "Investment Property Advisor"]
    },
    {
      id: 5,
      name: "Lisa Wang",
      image: "/home3.jpg",
      specialty: "commercial",
      experience: "10 years",
      rating: 4.9,
      properties: 41,
      phone: "+1 (555) 567-8901",
      email: "lisa.wang@rentease.com",
      description: "Commercial real estate expert with focus on retail and restaurant properties. Strong understanding of market trends and zoning regulations.",
      languages: ["English", "Mandarin", "Cantonese"],
      certifications: ["Retail Property Specialist", "Zoning Law Expert"]
    },
    {
      id: 6,
      name: "Robert Martinez",
      image: "/home5.jpg",
      specialty: "luxury",
      experience: "18 years",
      rating: 4.8,
      properties: 25,
      phone: "+1 (555) 678-9012",
      email: "robert.martinez@rentease.com",
      description: "Veteran luxury real estate agent with international clientele. Specializes in waterfront properties and exclusive estates.",
      languages: ["English", "Spanish", "Portuguese"],
      certifications: ["International Luxury Property", "Waterfront Specialist"]
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "all" || agent.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const openAgentModal = (agent) => {
    setSelectedAgent(agent);
  };

  const closeAgentModal = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-5 drop-shadow-lg">
            Our Expert Agents
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
            Connect with experienced real estate professionals who know your market
          </p>
        </div>
      </div>

      <div className="w-11/12 max-w-6xl mx-auto px-4 sm:px-5">
        {/* Search and Filter */}
        <div className="flex gap-3 sm:gap-5 my-6 sm:my-8 md:my-10 items-center flex-wrap sm:flex-col sm:items-stretch">
          <div className="flex-1 relative max-w-lg">
            <input
              type="text"
              placeholder="Search agents by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 sm:py-4 px-4 sm:px-5 pr-10 sm:pr-12 border-2 border-gray-200 rounded-full text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-100 placeholder:text-gray-400"
            />
            <span className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <div>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="py-3 sm:py-4 px-4 sm:px-5 border-2 border-gray-200 rounded-full text-sm sm:text-base bg-white cursor-pointer transition-colors duration-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Specialties</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 my-6 sm:my-8 md:my-10">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold text-gray-800">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs sm:text-sm">{agent.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-3 sm:mb-4 font-semibold">{agent.name}</h3>
                <div className="mb-4 sm:mb-5">
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold uppercase ${
                    agent.specialty === 'residential' ? 'bg-blue-100 text-blue-700' :
                    agent.specialty === 'commercial' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {agent.specialty.charAt(0).toUpperCase() + agent.specialty.slice(1)}
                  </span>
                </div>
                
                <div className="flex gap-3 sm:gap-5 mb-4 sm:mb-5">
                  <div className="text-center">
                    <span className="block text-xs sm:text-sm text-gray-600 mb-1 uppercase font-medium">Experience</span>
                    <span className="block text-lg sm:text-xl text-gray-800 font-semibold">{agent.experience}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs sm:text-sm text-gray-600 mb-1 uppercase font-medium">Properties</span>
                    <span className="block text-lg sm:text-xl text-gray-800 font-semibold">{agent.properties}</span>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-5">{agent.description.substring(0, 80)}...</p>
                
                <div className="mb-4 sm:mb-5">
                  {agent.languages.map(lang => (
                    <span key={lang} className="inline-block bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm mr-1 sm:mr-2 mb-1 sm:mb-2">
                      {lang}
                    </span>
                  ))}
                </div>
                
                <button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300"
                  onClick={() => openAgentModal(agent)}
                >
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16 px-5">
            <h3 className="text-3xl text-gray-800 mb-4">No agents found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Why Choose Our Agents */}
        <div className="my-12 sm:my-16 md:my-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 mb-8 sm:mb-10 md:mb-12 font-bold">Why Choose Our Agents?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 md:mb-5 block">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 font-semibold">Expertise</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">
                All our agents are licensed professionals with years of experience in their respective markets.
              </p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 md:mb-5 block">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 font-semibold">Personalized Service</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">
                We believe in building long-term relationships with our clients, not just closing deals.
              </p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 md:mb-5 block">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 font-semibold">Market Knowledge</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">
                Our agents stay updated with the latest market trends, pricing, and property availability.
              </p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 md:mb-5 block">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 font-semibold">Trust & Security</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">
                Your privacy and security are our top priorities. All transactions are handled with utmost confidentiality.
              </p>
            </div>
          </div>
        </div>

        {/* Become an Agent */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10 rounded-2xl text-center my-12 sm:my-16 md:my-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-3 sm:mb-4 md:mb-5 font-bold">Interested in Becoming an Agent?</h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Join our team of successful real estate professionals and help people find their perfect homes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
              <div className="flex items-center gap-2 sm:gap-3 justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span className="font-medium text-white text-sm sm:text-base">Flexible working hours</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-medium text-white text-sm sm:text-base">Competitive commission structure</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium text-white text-sm sm:text-base">Continuous training and support</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                <span className="font-medium text-white text-sm sm:text-base">Access to our platform and tools</span>
              </div>
            </div>
            <button className="bg-white text-indigo-600 border-none py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Agent Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5" onClick={closeAgentModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-5 right-5 bg-none border-none text-3xl cursor-pointer text-gray-600 z-10 hover:text-gray-800" 
              onClick={closeAgentModal}
            >
              ×
            </button>
            
            <div className="flex items-center gap-5 p-8 pb-5 border-b border-gray-200">
              <img 
                src={selectedAgent.image} 
                alt={selectedAgent.name} 
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-3xl text-gray-800 mb-3">{selectedAgent.name}</h2>
                <div className="mb-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${
                    selectedAgent.specialty === 'residential' ? 'bg-blue-100 text-blue-700' :
                    selectedAgent.specialty === 'commercial' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedAgent.specialty.charAt(0).toUpperCase() + selectedAgent.specialty.slice(1)}
                  </span>
                </div>
                <div className="font-semibold text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {selectedAgent.rating} Rating
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex gap-8 mb-6">
                <div className="text-center">
                  <span className="block text-sm text-gray-600 mb-1 uppercase font-medium">Experience</span>
                  <span className="block text-2xl text-gray-800 font-semibold">{selectedAgent.experience}</span>
                </div>
                <div className="text-center">
                  <span className="block text-sm text-gray-600 mb-1 uppercase font-medium">Properties Managed</span>
                  <span className="block text-2xl text-gray-800 font-semibold">{selectedAgent.properties}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-gray-800 mb-4 font-semibold">About {selectedAgent.name}</h3>
                <p className="text-gray-600 leading-relaxed m-0">{selectedAgent.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-gray-800 mb-4 font-semibold">Languages Spoken</h3>
                <div>
                  {selectedAgent.languages.map(lang => (
                    <span key={lang} className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm mr-3 mb-3">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-gray-800 mb-4 font-semibold">Certifications</h3>
                <ul className="list-none p-0 m-0">
                  {selectedAgent.certifications.map(cert => (
                    <li key={cert} className="py-2 border-b border-gray-200 text-gray-600 last:border-b-0">
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-gray-800 mb-4 font-semibold">Contact Information</h3>
                <div>
                  <div className="flex items-center gap-3 py-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600 font-medium">{selectedAgent.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 font-medium">{selectedAgent.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 pt-0 flex gap-4">
              <button className="flex-1 py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300">
                Contact Agent
              </button>
              <button className="flex-1 py-3 border-2 border-gray-200 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 bg-gray-50 text-gray-800 hover:bg-gray-100 hover:border-gray-300">
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentsPage;

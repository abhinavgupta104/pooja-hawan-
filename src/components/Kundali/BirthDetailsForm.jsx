import React, { useState, useEffect } from 'react';
import { searchLocations } from '../../services/kundaliService';

const BirthDetailsForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(formDataInit());
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  function formDataInit() {
    return {
      name: '',
      date: '2000-01-01',
      time: '12:00',
    };
  }

  // Debounce location search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (locationQuery.length >= 3 && !selectedLocation) {
        setIsSearchingLoc(true);
        const results = await searchLocations(locationQuery);
        setLocationResults(results);
        setIsSearchingLoc(false);
      } else {
        setLocationResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationQuery, selectedLocation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setLocationQuery(loc.name);
    setLocationResults([]);
  };

  const handleLocationChange = (e) => {
    setLocationQuery(e.target.value);
    setSelectedLocation(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please select a location from the dropdown");
      return;
    }
    onSubmit({
      ...formData,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 font-serif">Enter Birth Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            name="name" 
            required 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="e.g. Rahul Sharma"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input 
              type="date" 
              name="date" 
              required 
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
            <input 
              type="time" 
              name="time" 
              required 
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
          <input 
            type="text" 
            required 
            value={locationQuery}
            onChange={handleLocationChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="Type city name..."
            autoComplete="off"
          />
          
          {/* Autocomplete Dropdown */}
          {locationResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {locationResults.map((loc, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                  onClick={() => handleLocationSelect(loc)}
                >
                  <div className="font-medium text-gray-900">{loc.city || loc.name.split(',')[0]}</div>
                  <div className="text-xs text-gray-500 truncate">{loc.name}</div>
                </div>
              ))}
            </div>
          )}
          {isSearchingLoc && <p className="text-xs text-amber-600 mt-1">Searching locations...</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Calculating...' : 'Generate Free Kundali'}
        </button>

      </form>
    </div>
  );
};

export default BirthDetailsForm;

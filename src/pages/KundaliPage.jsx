import React from 'react';

const KundaliPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-7xl mx-auto">
        {/* We use an iframe to load the standalone HTML file requested by the user */}
        <iframe 
            src="/kundali-app/index.html" 
            style={{ width: '100%', height: '1200px', border: 'none', borderRadius: '12px' }}
            title="Kundali Generator"
        />
      </div>
    </div>
  );
};

export default KundaliPage;


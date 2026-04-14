import React from 'react';

const VirtualGarden = () => {
  return (
    <div style={{ 
      position: 'fixed', // ✅ Uses fixed positioning to break out of all parent padding
      top: '80px',       // Start exactly below your 80px Navbar
      left: 0,
      width: '100vw',    // Force full width
      height: 'calc(100vh - 80px)', // Force full height
      overflow: 'hidden',
      margin: 0,         // Ensure no margins
      paddingTop: 30,        // Ensure no padding
      zIndex: 1          // Ensure it's behind the Navbar
    }}>
      <iframe 
        src="/garden.html" 
        title="3D Virtual Garden"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          display: 'block' 
        }}
      />
    </div>
  );
};

export default VirtualGarden;
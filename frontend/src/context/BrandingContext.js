import React, { createContext, useState } from 'react';

export const BrandingContext = createContext();

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    companyColor: '#1976d2',
    companyName: '',
    companyLogo: '',
    companyId: null,
  });

  return (
    <BrandingContext.Provider value={{ branding, setBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

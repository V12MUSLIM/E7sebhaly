import  { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  const toggle = () => {
    setDark(prev => {
      console.log('Theme toggled from', prev, 'to', !prev);
      return !prev;
    });
  };

  useEffect(() => {
    console.log('Theme changed:', dark ? 'dark' : 'light');
    
    
    document.body.classList.remove('light', 'dark');
 
    document.body.classList.add(dark ? 'dark' : 'light');
    
  
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
    
    return () => {
   
      document.body.classList.remove('light', 'dark');
      document.body.removeAttribute('data-theme');
    };
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div className={dark ? 'dark' : 'light'} data-theme={dark ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     isAuthenticated: false,
//     user: null,
//   });

//   useEffect(() => {
//     // Example: Load user data from local storage or an API
//     const user = localStorage.getItem('user');
//     if (user) {
//       setAuth({
//         isAuthenticated: true,
//         user: JSON.parse(user),
//       });
//     }
//   }, []);

//   const login = (user) => {
//     localStorage.setItem('user', JSON.stringify(user));
//     setAuth({
//       isAuthenticated: true,
//       user,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setAuth({
//       isAuthenticated: false,
//       user: null,
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

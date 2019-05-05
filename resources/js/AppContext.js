import React, { createContext } from 'react';

export const AppContext = createContext();

export const AppProvider = props => (
    <AppContext.Provider value={props}>{props.children}</AppContext.Provider>
);

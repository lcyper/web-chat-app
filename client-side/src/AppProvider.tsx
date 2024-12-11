import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define el tipo de los datos del contexto
interface AppContextType {
    nickName: string;
    setNickName: (value: string) => void;
}

// Crea el contexto
const UserContext = createContext<AppContextType>({ nickName: '', setNickName: () => { } });

// Crea un proveedor
export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nickName, setNickName] = useState<string>('');

    return (
        <UserContext.Provider value={{ nickName, setNickName }}>
            {children}
        </UserContext.Provider>
    );
};

// export default UserContext;
// Hook para usar el contexto
export const useAppContext = (): AppContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider');
    return context;
};

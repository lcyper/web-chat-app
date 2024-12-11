import { createContext, ReactNode, useState } from "react";

const Context = createContext({})

interface Props {
    children: ReactNode;
}

export function UserContextProvider({ children }: Props) {
    const [UserContext, setUserContext] = useState([]);
    return <Context.Provider value={{ UserContext, setUserContext }}>
        {children}
    </Context.Provider>

}
export default Context;
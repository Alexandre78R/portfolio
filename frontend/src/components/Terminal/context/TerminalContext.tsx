// import React, { createContext, useContext, useRef, ReactNode, useMemo, useState } from 'react';

// type Term = {
//     arg: string[];
//     history: string[];
//     rerender: boolean;
//     index: number;
//     clearHistory?: () => void;
//     setArg?: (tab: []) => void;
//     setHistory?: (tab: []) => void;
//     setRerenderContext?: (bool: boolean) => void;
//     setIndex?: (index: number) => void;
// };

// const TerminalContext = createContext<Term | undefined >(undefined);

// export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [arg, setArg] = useState<[]>([]);
//   const [history, setHistory] = useState<[]>([]);
//   const [rerenderContext, setRerenderContext] = useState<boolean>(false);
//   const [index, setIndex] = useState<number>(0);

//   const value = useMemo(() => (
//     {
//       arg,
//       setArg,
//       history,
//       setHistory,
//       rerenderContext,
//       setRerenderContext,
//       index,
//       setIndex,
//     }
//   ), [arg, history, rerenderContext,index]);

//   return (
//     <TerminalContext.Provider value={value}>
//       {children}
//     </TerminalContext.Provider>
//   );
// };

//   export const useTerminal = (): Term => {
//     const context = useContext(TerminalContext);
//     if (context === undefined) {
//       throw new Error('termContext error');
//     }
//     return context;
//   };

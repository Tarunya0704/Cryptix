// 'use client'
// import { createContext, useContext, useState , ReactNode} from "react";

//  const AutoConnectContext = createContext<{
//   autoConnect: boolean;
//   setAutoConnect: (autoConnect: boolean) => void;
// }>({
//   autoConnect: false,
//   setAutoConnect: () => null,
// });

// export function useAutoConnect() {
//   const context = useContext(AutoConnectContext);
//   if (!context) {
//     throw new Error("useAutoConnect must be used within an AutoConnectProvider");
//   }
//   return context;
// }

// export function AutoConnectProvider({ children }: { children: React.ReactNode }) {
//   const [autoConnect, setAutoConnect] = useState<boolean>(false);
//   return (
//     <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
//       {children}
//     </AutoConnectContext.Provider>
//   );
// }

'use client'

import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type separately for better reusability
type AutoConnectContextType = {
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
};

// Create the context with a more specific type
const AutoConnectContext = createContext<AutoConnectContextType | undefined>(undefined);

// Export the provider component
export function AutoConnectProvider({ children }: { children: ReactNode }) {
  const [autoConnect, setAutoConnect] = useState<boolean>(false);

  // Create the value object
  const value = {
    autoConnect,
    setAutoConnect,
  };

  return (
    <AutoConnectContext.Provider value={value}>
      {children}
    </AutoConnectContext.Provider>
  );
}

// Export the hook
export function useAutoConnect(): AutoConnectContextType {
  const context = useContext(AutoConnectContext);
  
  if (context === undefined) {
    throw new Error("useAutoConnect must be used within an AutoConnectProvider");
  }
  
  return context;
}

// Make sure to export the provider as default as well
export default AutoConnectProvider;
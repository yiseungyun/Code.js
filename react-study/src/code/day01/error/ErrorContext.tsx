import { createContext } from "react";

const ErrorContext = createContext(null as string | null);

export const ErrorProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const temp = "임시 값";

  return (
    <ErrorContext.Provider value={temp}>
      {children}
      {/*토스트 메세지*/}
    </ErrorContext.Provider>
  );
};
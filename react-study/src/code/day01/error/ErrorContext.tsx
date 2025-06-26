import { createContext, useState } from "react";
import type { ErrorType } from "./ErrorType";

export const ErrorContext = createContext<(err: ErrorType) => void>(() => { });

export const ErrorProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const throwError = (errorType: ErrorType) => {
    console.log(errorType);
  }

  return (
    <ErrorContext.Provider value={throwError}>
      {children}
      {/*토스트 메세지*/}
    </ErrorContext.Provider>
  );
};
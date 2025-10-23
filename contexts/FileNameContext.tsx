import React, { createContext, useContext, useState, ReactNode } from "react";

interface FileNameContextType {
  fileName: string;
  setFileName: (name: string) => void;
}

const FileNameContext = createContext<FileNameContextType>({
  fileName: "Untitled File",
  setFileName: () => {},
});

export const FileNameProvider = ({ children }: { children: ReactNode }) => {
  const [fileName, setFileName] = useState("Untitled File");
  return (
    <FileNameContext.Provider value={{ fileName, setFileName }}>
      {children}
    </FileNameContext.Provider>
  );
};

export const useFileName = () => useContext(FileNameContext);

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FileNameContextType {
  fileName: string;
  setFileName: (name: string) => Promise<void>;
  isLoaded: boolean;
}

const FileNameContext = createContext<FileNameContextType>({
  fileName: "Untitled File",
  setFileName: async () => {},
  isLoaded: false,
});

export const FileNameProvider = ({ children }: { children: ReactNode }) => {
  const [fileName, setFileNameState] = useState("Untitled File");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load file name from storage on mount
  useEffect(() => {
    const loadFileName = async () => {
      try {
        const savedName = await AsyncStorage.getItem('fileName');
        console.log('Loaded file name from storage:', savedName);
        if (savedName !== null) {
          setFileNameState(savedName);
        }
      } catch (error) {
        console.error('Error loading file name:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadFileName();
  }, []);

  // Save file name to storage whenever it changes
  const setFileName = async (name: string) => {
    try {
      console.log('Setting file name to:', name);
      setFileNameState(name);
      await AsyncStorage.setItem('fileName', name);
      console.log('File name saved to storage successfully');
    } catch (error) {
      console.error('Error saving file name:', error);
    }
  };

  // Log whenever fileName changes
  useEffect(() => {
    console.log('Context fileName changed to:', fileName);
  }, [fileName]);

  return (
    <FileNameContext.Provider value={{ fileName, setFileName, isLoaded }}>
      {children}
    </FileNameContext.Provider>
  );
};

export const useFileName = () => useContext(FileNameContext);
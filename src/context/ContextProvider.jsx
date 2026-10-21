import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { api } from '../utils/api';

const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const activeRequests = useRef(0);

  useEffect(() => {
    const startLoading = () => {
      activeRequests.current += 1;
      setIsLoading(true);
    };

    const stopLoading = () => {
      activeRequests.current = Math.max(0, activeRequests.current - 1);
      if (activeRequests.current === 0) {
        setIsLoading(false);
      }
    };

    // Interceptor apenas para o Loading (Ativa)
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        startLoading();
        return config;
      },
      (error) => {
        stopLoading();
        return Promise.reject(error);
      }
    );

    // Interceptor apenas para o Loading (Desativa)
    const resInterceptor = api.interceptors.response.use(
      (response) => {
        stopLoading();
        return response;
      },
      (error) => {
        stopLoading();
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
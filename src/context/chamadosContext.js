import { createContext, useContext } from "react";

export const ChamadosContext = createContext(null);

export function useChamados() {
  const ctx = useContext(ChamadosContext);
  if (!ctx) {
    throw new Error("useChamados precisa ser usado dentro de <ChamadosProvider>");
  }
  return ctx;
}
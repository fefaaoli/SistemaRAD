import React, { createContext, useState, useContext } from 'react';

// 1. Cria o Contexto
const PeriodoContext = createContext();

// 2. Cria o Provedor (um componente que vai gerenciar e fornecer o estado)
export function PeriodoProvider({ children }) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState(''); 

  return (
    <PeriodoContext.Provider value={{ periodoSelecionado, setPeriodoSelecionado }}>
      {children}
    </PeriodoContext.Provider>
  );
}

// 3. Cria um "Hook" customizado para facilitar o uso do contexto nas páginas
export function usePeriodo() {
  return useContext(PeriodoContext);
}
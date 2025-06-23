import React from 'react';
import './SelecionarDisciplinas.css';
import Disciplinas from '../components/Disciplinas'; // Importando o componente Disciplinas

export default function SelecionarDisciplinas() {
  // Você pode passar disciplinas como prop ou deixar o componente usar as mockadas
  const disciplinasSelecionaveis = [
    // Exemplo de dados que podem vir do backend
    {
      codigo: "MAT101",
      nome: "Cálculo I",
      turma: "1º Semestre",
      tipo: "Obrigatória",
      turno: "Diurno"
    },
    {
      codigo: "FIS201",
      nome: "Física Geral",
      turma: "2º Semestre",
      tipo: "Obrigatória",
      turno: "Noturno"
    },
    {
      codigo: "LET102",
      nome: "Literatura Brasileira",
      turma: "1º Semestre",
      tipo: "Optativa Livre",
      turno: "Diurno"
    }
  ];

  return (
    <div className="selecionar-disciplinas-container">
      
      <Disciplinas/>
      
    </div>
  );
}
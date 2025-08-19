const DocenteModel = require('../models/docenteModel');
const { QueryTypes } = require('sequelize');
const db = require('../database');

// Função para pegar o último período cadastrado
async function getUltimoPeriodo() {
  const resultado = await db.query(
    "SELECT periodo FROM exp_horario ORDER BY CAST(periodo AS UNSIGNED) DESC LIMIT 1",
    { type: QueryTypes.SELECT }
  );

  return resultado.length > 0 ? resultado[0].periodo : null;
}

// Mapas de tradução
const diasSemana = {
  1: "segunda-feira",
  2: "terça-feira",
  3: "quarta-feira",
  4: "quinta-feira",
  5: "sexta-feira"
};

const horarios = {
  1: "08:00 às 09:40",
  2: "10:00 às 11:40",
  3: "19:00 às 20:40",
  4: "20:50 às 22:30"
};

class DocenteController {
  // Listar docentes (resumido)
  static async listarDocentes(req, res) {
    try {
      let { periodo } = req.query;

      if (!periodo) {
        periodo = await getUltimoPeriodo();
        if (!periodo) {
          return res.status(404).json({ error: 'Nenhum período encontrado no banco' });
        }
      }

      const docentes = await DocenteModel.listarResumido(periodo);
      res.json({ periodo, docentes });
    } catch (error) {
      console.error('Erro ao listar docentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter detalhes de um docente
  static async obterDetalhesDocente(req, res) {
    try {
      const { id } = req.params;
      let { periodo } = req.query;

      if (!periodo) {
        periodo = await getUltimoPeriodo();
        if (!periodo) {
          return res.status(404).json({ error: 'Nenhum período encontrado no banco' });
        }
      }

      const docente = await DocenteModel.obterDetalhado(id, periodo);

      if (!docente) {
        return res.status(404).json({ error: 'Docente não encontrado' });
      }

      // Traduz restrições de horário
      const restricoesTraduzidas = docente.restricoes_horario.map(r => ({
        dia: diasSemana[r.dia] || null,
        horario: horarios[r.horario] || null
      }));

      res.json({ 
        periodo, 
        ...docente, 
        restricoes_horario: restricoesTraduzidas 
      });
    } catch (error) {
      console.error('Erro ao obter detalhes do docente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = DocenteController;

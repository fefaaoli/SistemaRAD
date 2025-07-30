const { Horario } = require('../models');

/**
 * Controller para gerenciamento de períodos acadêmicos
 * Responsável por criar novos períodos e seus horários padrão
 */

exports.criarPeriodo = async (req, res) => {
  const { periodo } = req.body;

  // VALIDAÇÃO INICIAL 
  if (!periodo) {
    return res.status(400).json({ 
      success: false, 
      error: "O campo 'periodo' é obrigatório" 
    });
  }

  // VALIDAÇÃO DO FORMATO DO PERÍODO
  if (!/^\d{4}\/[12]$/.test(periodo)) {
    return res.status(400).json({
      success: false,
      error: "Formato de período inválido. Use o padrão AAAA/1 ou AAAA/2 (ex: 2025/1)",
      code: "FORMATO_INVALIDO"
    });
  }

  // VERIFICAÇÃO DE PERÍODO EXISTENTE 
  // Alteração importante: Agora verificamos especificamente o registro 'init' (ordem 0)
  // Isso evita falsos positivos com registros de dias/horários
  try {
    const periodoExistente = await Horario.findOne({
      where: { 
        periodo,
        ordem: 0,       // Filtra apenas o registro marcador
        cat: 'init'     // Garante que é o registro inicial
      },
      raw: true
    });

    // RESPOSTA PARA PERÍODO DUPLICADO 
    if (periodoExistente) {
      return res.status(400).json({ 
        success: false, 
        error: `O período ${periodo} já está cadastrado no sistema. Por favor, escolha outro período.`,
        code: "PERIODO_DUPLICADO" // Código padronizado para frontend
      });
    }

    // CRIAÇÃO DO REGISTRO INICIAL 
    await Horario.create({
      periodo,
      ordem: 0,        // Ordem zero indica registro inicial
      cat: 'init',      // Categoria especial
      valor: 'init'     // Valor padrão
    }, { hooks: false });

    // HORÁRIOS PADRÃO 
    const horariosPadrao = [
      // Dias da semana (cat: 'dia')
      { periodo, ordem: 10, cat: 'dia', valor: '2a feira' },
      { periodo, ordem: 20, cat: 'dia', valor: '3a feira' },
      { periodo, ordem: 30, cat: 'dia', valor: '4a feira' },
      { periodo, ordem: 40, cat: 'dia', valor: '5a feira' },
      { periodo, ordem: 50, cat: 'dia', valor: '6a feira' },
      
      // Horários de aula (cat: 'hora')
      { periodo, ordem: 10, cat: 'hora', valor: '08:00 às 09:40' },
      { periodo, ordem: 20, cat: 'hora', valor: '10:00 às 11:40' },
      { periodo, ordem: 50, cat: 'hora', valor: '19:00 às 20:40' },
      { periodo, ordem: 60, cat: 'hora', valor: '20:50 às 22:30' }
    ];

    // INSERÇÃO EM MASSA (Mais eficiente que inserts individuais)
    await Horario.bulkCreate(horariosPadrao);

    // RESPOSTA DE SUCESSO
    res.status(201).json({ 
      success: true, 
      message: `Período ${periodo} criado com horários padrão!`,
      horariosCriados: horariosPadrao.length // Mostra quantidade criada
    });

  } catch (err) {
    // TRATAMENTO DE ERROS 
    // Alteração: Adicionado tratamento específico para duplicatas
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false, 
        error: `O período ${periodo} já está cadastrado no sistema. Por favor, escolha outro período.`,
        code: "DUPLICATE_ENTRY" // Padronização de códigos de erro
      });
    }

    // ERRO GENÉRICO 
    res.status(500).json({ 
      success: false, 
      error: "Erro interno no servidor",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
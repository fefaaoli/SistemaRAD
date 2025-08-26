const fs = require('fs');
const path = require('path');
const { create } = require('xmlbuilder2');
const conn = require('../database'); 

const institutionName = "FEA-RP / Departamento de Administração";
const comments = "Default comments";

async function gerarXML() {
  try {
    // 1️⃣ Último período registrado
    const [periodos] = await conn.query(`
      SELECT periodo
      FROM exp_horario
      ORDER BY periodo DESC
      LIMIT 1
    `); 

    if (!periodos.length) throw new Error("Nenhum período encontrado no banco.");

    const periodo = periodos[0].periodo;
    console.log(`Gerando XML para o último período: ${periodo}`);

    // 2️⃣ Horários e dias
    const [horariosDB] = await conn.query(`
      SELECT valor FROM exp_horario 
      WHERE periodo = '${periodo}' AND cat = 'hora' 
      ORDER BY ordem
    `);

    const [diasDB] = await conn.query(`
      SELECT valor FROM exp_horario 
      WHERE periodo = '${periodo}' AND cat = 'dia' 
      ORDER BY ordem
    `);

    const horarios = horariosDB.map(h => h.valor);
    const dias = diasDB.map(d => d.valor);

    // 3️⃣ Semestres/turnos
    const [semestres] = await conn.query(`
      SELECT DISTINCT CONCAT(a.turma, ' ', a.tipo) AS semestre_turno
      FROM exp_atividade a
      JOIN exp_oferecimento o ON a.id = o.aid
      WHERE o.periodo = '${periodo}'
    `);

    // 4️⃣ Usuários
    const [usuarios] = await conn.query(`
      SELECT DISTINCT u.id, u.nome
      FROM usuarios u
      JOIN exp_inscricao i ON u.id = i.did
      WHERE i.periodo = '${periodo}'
    `);

    // 5️⃣ Disciplinas disponíveis
    const [disciplinas] = await conn.query(`
      SELECT a.id, a.cod, a.disciplina, a.cred, a.tipo, a.comentario
      FROM exp_atividade a
      JOIN exp_oferecimento o ON a.id = o.aid
      WHERE o.periodo = '${periodo}'
    `);

    // 6️⃣ Inscrições Teacher / Subject
    const [inscricoes] = await conn.query(`
      SELECT i.did, u.nome AS teacher_nome, a.cod, a.disciplina, a.cred, a.tipo
      FROM exp_inscricao i
      JOIN exp_oferecimento o ON i.aid = o.aid AND i.periodo = o.periodo
      JOIN exp_atividade a ON o.aid = a.id
      JOIN usuarios u ON i.did = u.id
      WHERE i.periodo = '${periodo}'
    `);

    // 7️⃣ Restrições dos docentes
    const [restricoes] = await conn.query(`
      SELECT r.docente, u.nome AS teacher_nome, r.dordem AS day, r.hordem AS hour
      FROM exp_restricao r
      JOIN usuarios u ON r.docente = u.id
      WHERE r.periodo = '${periodo}'
    `);

    // 8️⃣ Montagem do XML
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('fet', { version: '7.4.4' })
        .ele('Institution_Name').txt(institutionName).up()
        .ele('Comments').txt(comments).up();

    // Horários
    const hoursList = root.ele('Hours_List');
    hoursList.ele('Number').txt(horarios.length).up();
    horarios.forEach(h => hoursList.ele('Name').txt(h).up());

    // Dias
    const daysList = root.ele('Days_List');
    daysList.ele('Number').txt(dias.length).up();
    dias.forEach(d => daysList.ele('Name').txt(d).up());

    // Semestres/turnos
    const semestersList = root.ele('Semesters_List');
    semestres.forEach(s => semestersList.ele('Name4').txt(s.semestre_turno).up());

    // Usuários
    const usersList = root.ele('Users_List');
    usuarios.forEach(u => usersList.ele('Name5').txt(u.nome).up());

    // Disciplinas
    const disciplinesList = root.ele('Disciplines_List');
    disciplinas.forEach(d => disciplinesList.ele('Name6').txt(`${d.cod} - ${d.disciplina}`).up());

    // Teacher / Subject
    const teacherSubjectList = root.ele('Teacher_Subject_List');
    inscricoes.forEach(i => {
      const entry = teacherSubjectList.ele('TeacherEntry');
      entry.ele('Teacher').txt(i.teacher_nome).up();
      entry.ele('Subject').txt(`${i.cod} - ${i.disciplina}`).up();
      entry.ele('Duration').txt(i.cred || 0).up();
      entry.ele('Total_Duration').txt(i.cred || 0).up();
      entry.ele('Id').txt(i.did).up();
      entry.ele('Activity_Group_Id').txt(0).up();
      entry.ele('Active').txt(1).up();
      entry.ele('Weight_Percentage').txt(100).up();
    });

    // Restrições
    const restrictionsList = root.ele('Restrictions_List');
    const mapRestricoes = {};
    restricoes.forEach(r => {
      if (!mapRestricoes[r.teacher_nome]) mapRestricoes[r.teacher_nome] = [];
      mapRestricoes[r.teacher_nome].push({ day: r.day, hour: r.hour });
    });

    Object.keys(mapRestricoes).forEach(teacher => {
      const t = restrictionsList.ele('TeacherEntry');
      t.ele('Teacher').txt(teacher).up();
      t.ele('Number_of_Not_Available_Times').txt(mapRestricoes[teacher].length).up();
      mapRestricoes[teacher].forEach(r => {
        t.ele('Day').txt(r.day).up();
        t.ele('Hour').txt(r.hour).up();
        t.ele('Active').txt(1).up();
      });
    });

    // 9️⃣ Salvar XML
    const exportPath = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportPath)) fs.mkdirSync(exportPath);
    
    const nomeArquivo = `${periodo.replace(/\//g, '-')}_fet.xml`;
    const xmlString = root.end({ prettyPrint: true });
    fs.writeFileSync(path.join(exportPath, nomeArquivo), xmlString, 'utf8');
    console.log(`Arquivo ${nomeArquivo} gerado com sucesso!`);

    return nomeArquivo; // retorna o nome do arquivo
  } catch (err) {
    console.error("Erro ao gerar XML:", err);
    throw err; // lança para o backend tratar
  }
}

// ✅ Exporta a função
module.exports = { gerarXML };

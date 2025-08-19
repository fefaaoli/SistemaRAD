const db = require('../database');


class DocenteModel {
    static async listarResumido(periodo) {
        try {
            const query = `
            SELECT
                u.id,
                u.nome,
                u.setor,
                COUNT(DISTINCT ei.aid) AS total_disciplinas,
                COALESCE(ROUND(COUNT(DISTINCT er.hordem) / 4.0 * 100, 0), 0) AS percentual_restricao
            FROM exp_inscricao ei
            JOIN usuarios u ON u.id = ei.did
            LEFT JOIN exp_restricao er ON u.id = er.docente AND er.periodo = :periodo
            WHERE ei.periodo = :periodo
            GROUP BY u.id, u.nome;
            `;

            const results = await db.query(query, {
                replacements: { periodo },
                type: db.QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error('Erro no model listarResumido:', error);
            throw error;
        }
    }

    // A função obterDetalhado 
static async obterDetalhado(docenteId, periodo) {
    try {
        // Dados básicos do docente
        const [docente] = await db.query(
            `SELECT id, nome, id AS numero_usp, setor AS departamento
             FROM usuarios
             WHERE id = :docenteId AND admin = 0`,
            {
                replacements: { docenteId },
                type: db.QueryTypes.SELECT
            }
        );

        if (!docente) return null;

        // Disciplinas selecionadas
        const disciplinas = await db.query(
            `SELECT 
                a.cod AS codigo,
                a.disciplina AS nome,
                a.turma,
                COALESCE(ic.comentario, '') AS comentario,
                COALESCE(ic.idioma_en, 0) AS leciona_ingles,
                COALESCE(ic.apoio_leia, 0) AS apoio_leia,
                COALESCE(ic.max_alunos, 0) AS max_alunos
            FROM exp_inscricao ei
            JOIN exp_atividade a ON ei.aid = a.id
            LEFT JOIN exp_insc_comentario ic 
                ON ei.did = ic.did AND ei.aid = ic.aid AND ei.periodo = ic.periodo
            WHERE ei.did = :docenteId AND ei.periodo = :periodo`,
            {
                replacements: { docenteId, periodo },
                type: db.QueryTypes.SELECT
            }
        );

        // Restrições de horário
        const restricoes = await db.query(
            `SELECT 
                er.dordem AS dia,
                er.hordem AS horario
            FROM exp_restricao er
            WHERE er.docente = :docenteId 
            AND er.periodo = :periodo
            ORDER BY er.dordem, er.hordem`,
            {
                replacements: { docenteId, periodo },
                type: db.QueryTypes.SELECT
            }
        );

        return {
            ...docente,
            disciplinas,
            restricoes_horario: restricoes
        };
    } catch (error) {
        console.error('Erro no model obterDetalhado:', error);
        throw error;
    }
}

}

module.exports = DocenteModel;

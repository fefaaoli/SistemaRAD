const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { JWT_SECRET } = require('../middlewares/authMiddleware');
const { authenticate } = require('ldap-authentication');

// CONFIGURAÇÃO DO MODO TESTE
const MODO_TESTE = process.env.MODO_TESTE !== 'false'; // true por padrão
const USUARIO_TESTE = process.env.USUARIO_TESTE || 'teste@fearp.usp.br';
const SENHA_TESTE = process.env.SENHA_TESTE || '123456';

const authController = {

    // LOGIN COM LDAP DA FEA-RP + MODO TESTE
    login: async (req, res) => {
        try {
            const { email, username, senha } = req.body;

            // Username pode vir como email ou username
            const loginUSP = username || email;
            if (!loginUSP || !senha) {
                return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
            }

            // ======================================================
            // MODO TESTE - BYPASS LDAP (para desenvolvimento)
            // ======================================================
            if (MODO_TESTE && loginUSP === USUARIO_TESTE && senha === SENHA_TESTE) {
                console.log("MODO TESTE ATIVADO - Usuário:", loginUSP);
                
                // BUSCAR USUÁRIO EXISTENTE
                let usuario = await Usuario.findOne({
                    where: { email: USUARIO_TESTE }
                });

                if (!usuario) {
                    // CRIAR SENHA HASH
                    const saltRounds = 12;
                    const senhaHash = await bcrypt.hash(SENHA_TESTE, saltRounds);
                    
                    usuario = await Usuario.create({
                        id: "0000000", // Número USP Fictício para testes
                        nome: "Usuário de Teste (ADM)",
                        email: USUARIO_TESTE,
                        senha: senhaHash,
                        setor: "Administrador",
                        abvsetor: "ADM",
                        admin: 1
                    });
                    console.log("✅ Usuário de teste criado (Auto-Increment ID).");
                } else {
                    // Atualiza para garantir que é admin
                    await Usuario.update(
                        {
                            nome: "Usuário de Teste (ADM)",
                            setor: "Administrador",
                            abvsetor: "ADM",
                            admin: 1 
                        },
                        { where: { id_novo: usuario.id_novo } }
                    );

                    // Recarrega os dados atualizados
                    usuario = await Usuario.findByPk(usuario.id_novo);
                    console.log("✅ Usuário de teste atualizado.");
                }

                const token = jwt.sign(
                    {
                        id: usuario.id_novo, // Token usa a PK (id_novo) - CORRETO!
                        uspNumber: usuario.id, // Número USP
                        email: usuario.email,
                        admin: usuario.admin
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.json({
                    message: "Login de TESTE (ADMIN) realizado com sucesso!",
                    token,
                    usuario: {
                        id: usuario.id_novo, // ✅ Altere aqui: id deve ser id_novo
                        id_usp: usuario.id,  // ✅ Novo campo: número USP
                        nome: usuario.nome,
                        email: usuario.email,
                        setor: usuario.setor,
                        admin: usuario.admin,
                        abvsetor: usuario.abvsetor
                    }
                });
            }

            // ======================================================
            // AQUI COMEÇA O CÓDIGO REAL DO LDAP 
            // ======================================================

            // 1 - AUTENTICAÇÃO LDAP
            let userLDAP;
            try {
                userLDAP = await authenticate({
                    ldapOpts: { url: "ldap://ad.fearp.usp.br" },
                    userDn: `${loginUSP}@fea-rp.local`,
                    userPassword: senha,
                    userSearchBase: "DC=fea-rp,DC=local",
                    usernameAttribute: "sAMAccountName",
                    username: loginUSP,
                    attributes: [
                        "dn", "sn", "cn", "employeeID",
                        "mail", "givenName", "memberOf"
                    ]
                });
            } catch (e) {
                console.error("Erro LDAP:", e.message);
                return res.status(401).json({ message: "Credenciais inválidas no LDAP." });
            }

            // 2 - VERIFICAR USUÁRIO NO BANCO
            let usuario = await Usuario.findOne({
                where: { email: userLDAP.mail }
            });

            // 3 - SE NÃO EXISTIR, CRIAR
            if (!usuario) {
                const saltRounds = 12;
                const senhaHash = await bcrypt.hash('senha_temp_ldap_' + Date.now(), saltRounds);
                
                // DETERMINAR ABVSETOR
                let abvsetor = "DOC"; 
                if (userLDAP.memberOf && userLDAP.memberOf.some(grupo => 
                    grupo.includes('Administrativo') || grupo.includes('ADM'))) {
                    abvsetor = "ADM";
                } else if (userLDAP.memberOf && userLDAP.memberOf.some(grupo => 
                    grupo.includes('Aluno') || grupo.includes('ALU'))) {
                    abvsetor = "ALU";
                }
                
                const numeroUSP = userLDAP.employeeID || loginUSP;

                usuario = await Usuario.create({
                    id: numeroUSP,
                    nome: userLDAP.cn,
                    email: userLDAP.mail,
                    senha: senhaHash,
                    setor: "Docente",
                    abvsetor: abvsetor,
                    admin: 0
                });
                
                console.log("✅ Novo usuário LDAP criado. ID Interno:", usuario.id_novo, "USP:", usuario.id);
            }

            // 4 - GERAR TOKEN JWT
            const token = jwt.sign(
                {
                    id: usuario.id_novo, // ✅ id no token é id_novo (PK)
                    uspNumber: usuario.id, // Número USP
                    email: usuario.email,
                    admin: usuario.admin
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // 5 - RETORNO FINAL
            res.json({
                message: "Login realizado com sucesso!",
                token,
                usuario: {
                    id: usuario.id_novo, // ✅ Altere aqui: id deve ser id_novo
                    id_usp: usuario.id,  // ✅ Novo campo: número USP
                    nome: usuario.nome,
                    email: usuario.email,
                    setor: usuario.setor,
                    admin: usuario.admin,
                    abvsetor: usuario.abvsetor,
                    
                    // Dados adicionais do LDAP (opcional):
                    gruposAD: userLDAP.memberOf,
                }
            });

        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    logout: (req, res) => {
        res.json({ message: "Logout realizado com sucesso." });
    },

    verify: async (req, res) => {
        try {
            console.log('🔍 [VERIFY] Usuário do middleware:', {
                id_novo: req.usuario.id_novo,
                id: req.usuario.id,
                nome: req.usuario.nome,
                email: req.usuario.email
            });

            // req.usuario já vem completo do middleware
            res.json({
                usuario: {
                    id: req.usuario.id_novo,    // ✅ id é id_novo (PK)
                    id_usp: req.usuario.id,     // ✅ id_usp é o número USP
                    nome: req.usuario.nome,
                    email: req.usuario.email,
                    setor: req.usuario.setor,
                    admin: req.usuario.admin,
                    abvsetor: req.usuario.abvsetor
                }
            });
        } catch (error) {
            console.error('Erro no verify:', error);
            res.status(500).json({ message: 'Erro ao verificar token.' });
        }
    },

    definirSenha: async (req, res) => {
        try {
            const { id, novaSenha } = req.body;
            
            // req.usuario.id agora é id_novo (do token)
            // O frontend deve enviar o id_novo também
            if (req.usuario.id_novo !== parseInt(id) && req.usuario.admin !== 1) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            const saltRounds = 12;
            const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

            await Usuario.update(
                { senha: senhaHash },
                { where: { id_novo: id } }
            );

            res.json({ message: 'Senha definida com sucesso.' });
        } catch (error) {
            console.error('Erro ao definir senha:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    statusTeste: (req, res) => {
        res.json({
            modoTeste: MODO_TESTE,
            usuarioTeste: USUARIO_TESTE,
            senhaTeste: SENHA_TESTE ? '***' : 'não definida',
            mensagem: MODO_TESTE 
                ? 'Modo teste ATIVO - use: ' + USUARIO_TESTE + ' / ' + SENHA_TESTE
                : 'Modo teste INATIVO'
        });
    }
};

module.exports = authController;
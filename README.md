# Sistema RAD - Geração e Gerenciamento de Horários de Aulas

![FEA-RP/USP](https://img.shields.io/badge/FEA--RP-USP-blue)
![Tecnologia](https://img.shields.io/badge/Tecnologia-Node.js-green)
![Banco de Dados](https://img.shields.io/badge/Banco%20de%20Dados-MySQL-orange)
![Container](https://img.shields.io/badge/Container-Docker-blueviolet)

## Sobre o Projeto

[cite_start]O **Sistema RAD** é uma aplicação web para otimizar o processo de atribuição de horários de aulas no Departamento de Administração (RAD) da FEA-RP/USP[cite: 10]. [cite_start]O projeto substitui o processo anterior, que envolvia etapas manuais, por uma solução mais eficiente, segura e intuitiva para **Administradores** e **Docentes**[cite: 11, 28]. [cite_start]O objetivo final é automatizar a coleta de preferências de horários e gerar um arquivo XML compatível com o software de alocação **FET**[cite: 14, 39].

[cite_start]A implementação desta ferramenta busca reduzir o tempo administrativo gasto na tarefa, diminuir os conflitos de horários e aumentar a transparência do processo para os docentes[cite: 18, 20, 21, 26].

## Funcionalidades Principais

### Para Administradores

* [cite_start]**Gestão do Período:** Criar períodos letivos [cite: 75][cite_start], configurar disciplinas [cite: 75][cite_start], definir horários padrão e gerenciar usuários do sistema[cite: 79, 80, 81, 82, 83].
* [cite_start]**Configuração de Regras:** Definir a data limite para a escolha dos docentes [cite: 77] [cite_start]e as restrições gerais de preenchimento[cite: 77].
* [cite_start]**Acompanhamento:** Visualizar as disciplinas [cite: 87] [cite_start]e restrições de horários submetidas pelos docentes[cite: 87].
* [cite_start]**Exportação de Dados:** Gerar e exportar um arquivo XML com todos os dados consolidados, compatível com o software FET[cite: 91].

### Para Docentes

* [cite_start]**Seleção de Disciplinas:** Escolher as disciplinas que desejam lecionar a partir de uma lista disponibilizada pelo administrador[cite: 95].
* [cite_start]**Definição de Preferências:** Indicar restrições de horários [cite: 95] [cite_start]e adicionar comentários ou informações relevantes às disciplinas escolhidas, como o idioma da aula[cite: 95].
* [cite_start]**Visualização e Edição:** Consultar e modificar as escolhas de disciplinas a qualquer momento antes do prazo final estabelecido[cite: 95].
* [cite_start]**Notificações:** Receber alertas visuais e por e-mail sobre prazos importantes e outras atualizações do sistema[cite: 95].

## Tecnologias Utilizadas

* [cite_start]**Backend:** Node.js, Express [cite: 27, 62]
* [cite_start]**Banco de Dados:** MySQL [cite: 27, 62]
* [cite_start]**Containerização:** Docker [cite: 27, 62]

---

[cite_start]Desenvolvido por **Maria Fernanda Maia de Oliveira** [cite: 4]
[cite_start]Orientador: **Ildeberto Aparecido Rodello** [cite: 4]

[cite_start]**Universidade de São Paulo (USP)** [cite: 1]
[cite_start]**Faculdade de Economia, Administração e Contabilidade de Ribeirão Preto (FEA-RP)** [cite: 2]
[cite_start]**Ribeirão Preto - SP, 2025** [cite: 5]

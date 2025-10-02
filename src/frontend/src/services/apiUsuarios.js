const API_URL = `${process.env.REACT_APP_API_URL}/api/admin`;

export const apiUsuarios = {
  async listarDocentes() {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) throw new Error('Erro ao carregar docentes');
      const data = await response.json();
      
      // Transforme os dados da API para o formato esperado pelo frontend
      return data.map(usuario => ({
        numeroUSP: usuario.id.toString(),
        nome: usuario.nome,
        email: usuario.email,         // inclui email
        setor: usuario.setor,
        abvsetor: usuario.abvsetor,   // inclui abreviação do setor
        funcao: usuario.admin === 1 ? 'Administrador' : 'Docente',
      }));
      
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async adicionarDocente(dados) {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: dados.numeroUSP,
          nome: dados.nome,
          email: dados.email,
          setor: dados.setor,
          admin: dados.funcao === 'Administrador' ? 1 : 0,
          senha: dados.senha || 'senha_temporaria' // Em produção, gere uma senha segura
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar docente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async atualizarDocente(id, dados) {
    try {
      // Prepara os dados que serão enviados para a API
      const dadosParaAPI = {
        nome: dados.nome,
        email: dados.email,
        setor: dados.setor,
        abvsetor: dados.abvsetor,
        admin: dados.funcao === 'Administrador' ? 1 : 0,
      };

      // Inclui a senha somente se estiver preenchida
      if (dados.senha && dados.senha.trim() !== "") {
        dadosParaAPI.senha = dados.senha;
      }

      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaAPI)
      });

      if (!response.ok) throw new Error('Erro ao atualizar docente');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  async removerDocente(id) {
      try {
          const response = await fetch(`${API_URL}/usuarios/${id}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  // Adicionar headers de autenticação 
              }
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Erro ao remover docente');
          }
          
          return response.status === 204 ? {} : await response.json();
      } catch (error) {
          console.error('Erro na API:', error);
          throw error;
      }
  }

};
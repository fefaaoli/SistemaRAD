export const isAdmin = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario && usuario.admin === 1;
};

export const isDocente = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario && usuario.admin === 0;
};

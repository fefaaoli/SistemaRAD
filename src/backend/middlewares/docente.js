module.exports = (req, res, next) => {
  if (req.user?.admin) {
    return res.status(403).json({ 
      error: 'Acesso restrito a docentes',
      solution: 'Adicione o header: { "user-type": "docente" }' 
    });
  }
  next();
};
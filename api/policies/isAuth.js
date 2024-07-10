// api/policies/isAuthenticated.js
module.exports = async function (req, res, proceed) {
  // Verifica se o usuário está autenticado
  if (!req.session.userId) {
    return res.redirect('/');
  }

  // Verifica se o usuário está autorizado para acessar a página
  const userId = req.session.userId;
  const requestedUserId = req.param('userId'); // ID do usuário solicitado na URL

  if (userId != requestedUserId) {
    return res.redirect('/');
  }

  return proceed();
};

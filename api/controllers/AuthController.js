/**
 * AuthController
 *
 * @description :: Controller de autenticação de login e verificação das permissões de acesso dos usuários.
 */

const bcrypt = require('bcrypt');

module.exports = {

  loginpage: async function (req, res) {
    try {
      return res.view('pages/tela-login', { currentPage: 'login' });
    } catch (error) {
      return res.serverError(error);
    }
  },

  login: async function (req, res) {
    const { type, email, password } = req.body;

    // Verificar se o username e a password foram fornecidos
    if (!email || !password) {
      return res.badRequest({ error: "Username and password are required" });
    }

    try {
      let user;
      let tela;
      //verifica qual usuário está tentando logar
      if (type == "Engenheiro") {
        //encontrando o engenheiro
        user = await Engineer.findOne({ emails: email });
        if (!user) {
          return res.json({error: "Invalid email and/or password are required" });
        }
        //definindo a tela de redirecionamento
        tela = "/dashboard/";
      } else if (type == "Montador") {
        //encontrando o montador
        user = await Worker.findOne({ emails: email });
        if (!user) {
          return res.json({error: "Invalid email and/or password are required" });
        }
        //definindo a tela de redirecionamento
        tela = "/kanban/";
      }
      //verificando a senha do usuário
      const match = await bcrypt.compare(password, user.passwords);      ;
      if (!match) {
        return res.json({error: "Invalid email and/or password are required" });
      }
      // Autenticação bem-sucedida
      req.session.userId = user.id;
      return res.json({ message: "Login successful", tela: tela + user.id});
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  kanban: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Worker.findOne({ id: req.params.userId });

      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-kanban', { user: user, currentPage: 'kanban' });
    } catch (error) {
      return res.serverError(error);
    }
  },

  manual: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Worker.findOne({ id: req.params.userId });
      const manual = await Manual.findOne({ id: req.params.manualId });
      const delegation = await Delegation.findOne({ id: req.params.delegationId})

      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-manuais', { user: user, currentPage: 'manual', manual: manual, delegation: delegation });
    } catch (error) {
      return res.serverError(error);
    }
  },

  dashboard: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Engineer.findOne({ id: req.params.userId });

      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-dashboard', { user: user, currentPage: 'dashboard' });
    } catch (error) {
      return res.serverError(error);
    }
  },

  delegation: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Engineer.findOne({ id: req.params.userId });

      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-delegations', { user: user, currentPage: 'delegacao' });
    } catch (error) {
      return res.serverError(error);
    }
  },

  repositorio: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Engineer.findOne({ id: req.params.userId });

      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-repositorio', { user: user, currentPage: 'repositorio' });
    } catch (error) {
      return res.serverError(error);
    }
  },

  repositorioCreate: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Engineer.findOne({ id: req.params.userId });

      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-add-manual', { user: user, currentPage: 'repositorio-create' });
    } catch (error) {
      return res.serverError(error);
    }
  },

  atualizar: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Engineer.findOne({ id: req.params.userId });
      const manual = await Manual.findOne({ id: req.params.manualId});


      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-atualizar-manual', { user: user, currentPage: 'atualizar-manual', manual: manual });
    } catch (error) {
      return res.serverError(error);
    }
  },

  atualizarFiles: async function (req, res) {
    if (!req.session.userId || req.session.userId != req.params.userId) {
      return res.forbidden({ message: 'You are not authorized to view this page.' });
    }

    try {
      const user = await Engineer.findOne({ id: req.params.userId });
      const manual = await Manual.findOne({ id: req.params.manualId});


      if (!user) {
        return res.notFound({ message: 'User not found.' });
      }

      return res.view('pages/tela-atualizar-files', { user: user, currentPage: 'atualizar-file', manual: manual });
    } catch (error) {
      return res.serverError(error);
    }
  },

  logout: async function (req, res) {
    req.session.destroy();
    if(err){
      return res.serverError(err);
    }
    return res.redirect('/login');
  }
 
};

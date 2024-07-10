/**
 * ManualController
 *
 * @description :: Controller utilizado para criar, buscar, atualizar e deletar manuais no Model Manual
 */

module.exports = {

    //metodo que cria um novo manual
    create: async function (req, res) {
      try {
          //criando um novo manual
          const man = await Manual.create(req.body).fetch();
          const currentPage = 'add-file'
          //feedback para o usuario
          return res.view('pages/tela-add-files', {manual: man, user: req.session.userId, currentPage: currentPage});
      } catch (err) {
          //erros gerais
          return res.status(500).json({ error: "Internal server error" });
      }
  },
  

  //metodo que faz select * em manual
  getAll: async function (req, res) {
    try {
      //fazendo select * em manual
      const manuals = await Manual.find();

      //retornando o select
      return res.json(manuals);
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  //metodo que faz select * from manual where id= id requisitado
  getById: async function (req, res) {
    try {
      //pegando o id requisitado
      const manualId = req.params.id;

      //fazendo o select
      const manual = await Manual.findOne({ id: manualId});

      //retornando o select
      return res.json(manual);
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  //metodo que atualiza o registro de um manual
  update: async function (req, res) {
    try {
      const manualId = req.params.id;
      
      if (!(await Manual.findOne({ id: manualId }))) {
        return res.status(404).json({ error: 'Manual not found' });
      }

      const man = await Manual.updateOne({ id: manualId }).set(req.body);

      return res.json({ message: 'Manual updated successfully!', manual: man });
    } catch (err) {
      console.error('Erro ao atualizar o manual:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  //metodo que deleta o registro de um manual
  delete:  async function (req, res) {
    try {
      //pegando o id requisitado
      const manualId = req.params.id;
      //deletando o registro

      const deletedDelegation = await Delegation.destroy({ manuals_id: manualId});
      const deletedLinks = await File.destroy({manuals_id: manualId});
      const deletedManual = await Manual.destroyOne({ id: manualId });

      //vendo se o registro existe
      if (!deletedManual) {
        return res.status(404).json({ error: 'Manual not found' });
      }

      //feedback para o usuario
      return res.json({ message: 'Manual deleted successfully!' });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

};

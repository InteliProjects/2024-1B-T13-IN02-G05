/**
 * DelegationController
 *
 * @description :: Controller utilizado para a criar, buscar e atualizar as delegações feitas na aplicação.
 */

module.exports = {
  //metodo que cria uma nova delegacao
  create: async function (req, res) {
    try {
      //criando a nova delegacao
      const delg = await Delegation.create(req.body).fetch();

      //feedback para o usuario
      return res.json({ message: 'Delegation created successfully!', delegation: delg });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  //metodo que faz select * em delegation
  getAll: async function (req, res) {
    try {
      //fazendo select * em delegation
      const delegations = await Delegation.find();

      //retornando o select
      return res.json(delegations);
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  //metodo que faz select * from delegation where id= id requisitado
  getById: async function (req, res) {
    try {
      //pegando o id requisitado
      const delegationId = req.params.id;

      //fazendo o select
      const delegation = await Delegation.findOne({ id: delegationId});

      //retornando o select
      return res.json(delegation);
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  //metodo que atualiza o registro de uma delegation
  update: async function (req, res) {
    try {
      //pegando o id
      const delegationId = req.params.id;

      //vendo se o registro realmente existe
      if (!(await Delegation.findOne({ id: delegationId }))) {
        return res.status(404).json({ error: 'Delegation not found' });
      }

      //atualizando o registro
      const delg = await Delegation.update({ id: delegationId }, req.body);

      //feedback para o usuario
      return res.json({ message: 'Delegation updated successfully!', delegation: delg });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  //metodo que deleta o registro de uma delegation
  delete:  async function (req, res) {
    try {
      //pegando o id requisitado
      const delegationId = req.params.id;

      //deletando o registro
      const deletedDelegation = await Delegation.destroyOne({ id: delegationId });

      //verificando se o registro realmente existe
      if (!deletedDelegation) {
        return res.status(404).json({ error: 'Delegation not found' });
      }

      //feedback para o usuario
      return res.json({ message: 'Delegation deleted successfully!' });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  search: async function (req, res) {
    const idUser = req.params.workers_id;
    try {
      const manual = await Delegation.find({ workers_id: idUser }).populate("manuals_id");
      return res.json(manual);
    } catch(err) {
      return res.serverError(err);
    }
  },

  getDone: async function (req, res) {
    try {
      const quantidadeDone = await Delegation.count({ done: true });
      return res.json(quantidadeDone);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getDoing: async function (req, res) {
    try {
      const quantidadeDoing = await Delegation.count({ doing: true });
      return res.json(quantidadeDoing);
    } catch (error) {
      return res.serverError(error);
    }
  },

  getByManual: async function (req, res) {
    try {
      const manual_id = req.params.manual_id;
      const delegations = await Delegation.find({ manuals_id: manual_id });
      return res.json(delegations);
    } catch (error) {
      return res.serverError(error);
    }
  }
};
/**
 * EngineerController
 *
 * @description :: Controller utilizado para criar, buscar, atualizar e deletar usuários do Model de Engineer
 */

module.exports = {
  //metodo que cria um novo engineer
  create: async function (req, res) {
    try {
      //criando novo engenheiro
      let { registrations, names, emails, passwords, birthdays} = req.body;
    
      // Validações e manipulações de dados usando o helper
      registrations = await sails.helpers.dadosService.with({ column: 'registrations', value: registrations, type: 'string' });
      names = await sails.helpers.dadosService.with({ column: 'names', value: names, type: 'string', rules: { min: 2, max: 150 } });
      emails = await sails.helpers.dadosService.with({ column: 'emails', value: emails, type: 'string' });
      passwords = await sails.helpers.dadosService.with({ column: 'passwords', value: passwords, type: 'string', rules: { min: 8, password: true} });
      birthdays = await sails.helpers.dadosService.with({ column: 'birthdays', value: birthdays, type: 'date' });

      const eng = await Engineer.create({registrations, names, emails, passwords, birthdays }).fetch();

      //feedback para o usuario
      return res.json({
        message: "Engineer created successfully!",
        engineer: eng,
      });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  //metodo que faz select * em engineer
  getAll: async function (req, res) {
    try {
      //fazendo select * em engineer
      const engineers = await Engineer.find();

      //retornando o select
      return res.json(engineers);
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  //metodo que faz select * from engineer where id= id requisitado
  getById: async function (req, res) {
    try {
      //pegando o id requisitado
      const engineerId = req.params.id;

      //fazendo o select
      const engineer = await Engineer.findOne({ id: engineerId });

      //retornando o select
      return res.json(engineer);
    } catch (err) {
      //erros gerais
      return res.serverError(err);
    }
  },

  //metodo que atualiza o registro de um engineer
  update: async function (req, res) {
    try {
      //pegando o id requisitado
      const engineerId = req.params.id;

      //vendo se o registro existe
      if (!(await Engineer.findOne({ id: engineerId }))) {
        return res.status(404).json({ error: "Engineer not found" });
      }

      //atualizando o registro
      const eng = await Engineer.update({ id: engineerId }, req.body);

      //feedback para o usuario
      return res.json({
        message: "Engineer updated successfully!",
        engineer: eng,
      });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  //metodo que deleta o registro de um engineer
  delete: async function (req, res) {
    try {
      //pegando o id requisitado
      const engineerId = req.params.id;

      //deletando o registro
      const deletedEngineer = await Engineer.destroyOne({ id: engineerId });

      //vendo se o registro existe
      if (!deletedEngineer) {
        return res.status(404).json({ error: "Engineer not found" });
      }

      //feedback para o usuario
      return res.json({ message: "Engineer deleted successfully!" });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

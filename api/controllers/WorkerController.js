/**
 * WorkerController
 *
 * @description :: Controller utilizado para criar, buscar, atualizar e deletar montadores na Model Worker
 */

module.exports = {

  //metodo que cria um novo worker
  create: async function (req, res) {
    try {
      //criando um novo worker
      let { registrations, names, emails, passwords, birthdays, lines} = req.body;
    
      // Validações e manipulações de dados usando o helper
      registrations = await sails.helpers.dadosService.with({ column: 'registrations', value: registrations, type: 'string' });
      names = await sails.helpers.dadosService.with({ column: 'names', value: names, type: 'string', rules: { min: 2, max: 150 } });
      emails = await sails.helpers.dadosService.with({ column: 'emails', value: emails, type: 'string' });
      passwords = await sails.helpers.dadosService.with({ column: 'passwords', value: passwords, type: 'string', rules: { min: 8, password: true} });
      birthdays = await sails.helpers.dadosService.with({ column: 'birthdays', value: birthdays, type: 'date' });
      lines = await sails.helpers.dadosService.with({ column: 'lines', value: lines, type: 'string' });

      const wor = await Worker.create({registrations, names, emails, passwords, birthdays, lines }).fetch();

      //feedback para o usuario
      return res.json({ message: "Worker created successfully!", worker: wor });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  //metodo que faz select * em worker
  getAll: async function (req, res) {
    try {
      //fazendo select * em worker
      const workers = await Worker.find();

      //retornando o select
      return res.json(workers);
    } catch (err) {
      return res.serverError(err);
    }
  },

  //metodo que faz select * from worker where id= id requisitado
  getById: async function (req, res) {
    try {
      //pegando o id requisitado
      const workerId = req.params.id;

      //fazendo o select
      const worker = await Worker.findOne({ id: workerId });

      //retornando o select
      return res.json(worker);
    } catch (err) {
      return res.serverError(err);
    }
  },

  getUniqueLines:  async function (req, res) {
    try {
      Worker.query('SELECT DISTINCT "lines" FROM "worker"', [], (err, result) => {
          if (err) {
              return res.serverError(err);
          }

          const uniqueLines = result.rows.map(row => row.lines);
          return res.json(uniqueLines);
      });
  } catch (error) {
      return res.serverError(error);
  }

  },

  //metodo que atualiza o registro de um worker
  update: async function (req, res) {
    try {
      //pegando o id do worker
      const workerId = req.params.id;

      //vendo se o registro existe
      if (!(await Worker.findOne({ id: workerId }))) {
        return res.status(404).json({ error: "Worker not found" });
      }

      //atualizando o registro
      const wor = await Worker.update({ id: workerId }, req.body);

      //feedback para o usuario
      return res.json({ message: "Worker updated successfully!", worker: wor });
    } catch (err) {
      //erros gerais
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  //metodo que deleta o registro de um worker
  delete: async function (req, res) {
    try {
      //pegando o id requisitado
      const workerId = req.params.id;

      //deletando o registro
      const deletedWorker = await Worker.destroyOne({ id: workerId });

      //vendo se o registro existe
      if (!deletedWorker) {
        return res.status(404).json({ error: "Worker not found" });
      }

      //feedback para o usuario
      return res.json({ message: "Worker deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

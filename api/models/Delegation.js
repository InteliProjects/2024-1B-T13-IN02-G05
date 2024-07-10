/**
 * Delegation.js
 *
 * @description :: Um model é uma tabela no banco de dados. Esse model guarda as delegações dos engenheiros para os trabalhadores. Identifica todos por meio de chaves estrangeiras (xxx_id). Selecionando um(1) manual por delegação.
 */

const defaults = require("sails-hook-sockets/lib/defaults");

module.exports = {
  attributes: {
    engineers_id: {
      model: "engineer",
      required: true,
    },
    workers_id: {
      model: "worker",
      required: true,
    },
    manuals_id: {
      model: "manual",
      required: true,
    },
    doing: {
      type: "boolean",
      defaultsTo: false,
    },
    done: {
      type: "boolean",
      defaultsTo: false,
    },
  },
};

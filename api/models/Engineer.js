/**
 * Engineers.js
 *
 * @description :: Um Model é uma tabela no banco de dados. Esse model guarda as informações dos usuários Engenheiros, capazes de fazer delegações e acessarem as abas exclusivas: Dashboard, Delegação e Criação de Manuais.
 */

module.exports = {
  attributes: {
    registrations: {
      type: "string",
      columnName: "registrations",
      required: true,
    },
    names: {
      type: "string",
      columnName: "names",
      required: true,
    },
    emails: {
      type: "string",
      isEmail: true,
      required: true,
      unique: true
    },
    passwords: {
      type: "string",
      minLength: 8,
      required: true,
    },
    birthdays: {
      type: "ref", // 'ref' significa que é um tipo de dados não específico
      columnType: "date",
      columnName: "birthdays",
    },
    actives: {
      type: "boolean",
      columnName: "actives",
      defaultsTo: true,
    },

    delegations: {
      collection: "delegation",
      via: "engineers_id",
    },
  },
};

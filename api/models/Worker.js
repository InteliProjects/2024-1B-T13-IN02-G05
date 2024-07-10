/**
 * Worker.js
 *
 * @description :: Um model é uma tabela no banco de dados. Esse model armazena os dados relativos aos usuários com categoria de workers (montadores, basicamente). Identifica, também, as delegações associadas a esse trabalhador.
 */

module.exports = {
  attributes: {
    registrations: {
      type: "string",
      required: true,
    },

    names: {
      type: "string",
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
      type: "ref",
      columnType: "date",
      required: true,
    },

    lines: {
      type: "string",
      required: true,
    },

    actives: {
      type: "boolean",
      defaultsTo: true,
    },

    delegations: {
      collection: "delegation",
      via: "workers_id",
    },
  },
};

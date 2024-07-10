/* eslint-disable camelcase */
/**
 * Manual.js
 *
 * @description :: Um model é uma tabela no banco de dados. Esse model armazena as informações relativas aos manuais. Ele recebe, também, os arquivos vindos do model "files"
 */

module.exports = {
  attributes: {
    names: {
      type: "string",
      required: true,
    },
    categories: {
      type: "string",
      required: true,
    },
    sub_categories1: {
      type: "string",
    },
    sub_categories2: {
      type: "string",
    },
    sub_categories3: {
      type: "string",
    },
    sub_categories4: {
      type: "string",
    },
    sub_categories5: {
      type: "string",
    },
    update_descriptions: {
      type: "string",
    },
    active: {
      type: "boolean",
      defaultsTo: true,
    },
    delegations: {
      collection: "delegation",
      via: "manuals_id",
    },

    files: {
      collection: "file",
      via: "manuals_id",
    },
  },
};

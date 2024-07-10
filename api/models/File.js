/**
 * Files.js
 *
 * @description :: Um model é uma tabela no banco de dados. Esse model armazena todos os arquivos existentes no banco. Cada item é um arquivo que pode ser associado a um manual. Um arquivo pode ser associado a mais de um manual.
 */

module.exports = {
  attributes: {
    manuals_id: {
      model: "manual",
      columnName: "manuals_id",
    },
    names: {
      type: "string",
      columnName: "names",
    },
    types: {
      type: "string",
      columnName: "types",
      required: true,
    },
    url: {
      type: "string",
      columnName: "url",
      required: true,
    },
  },
};

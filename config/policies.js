/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const { repositorioCreate } = require("../api/controllers/AuthController");

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/
  // '*': true,
  '*': true, // Permite acesso por padrão a todas as rotas

  // Aplica a política de autorização personalizada às rotas de authentication
  AuthController: {
    'kanban': 'isAuth',
    'dashboard': 'isAuth',
    'delegation': 'isAuth',
    'repositorio': 'isAuth',
    'repositorioCreate': 'isAuth'
  }
};

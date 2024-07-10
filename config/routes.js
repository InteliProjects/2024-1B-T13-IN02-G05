/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const AuthController = require('../api/controllers/AuthController');

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
  //rotas paras as views
  '/': 'AuthController.loginpage', //css conflicts resolved
  '/kanban/:userId': 'AuthController.kanban', //css conflicts resolved
  '/kanban/manual/:userId/:manualId/:delegationId': 'AuthController.manual',
  '/dashboard/:userId': 'AuthController.dashboard', //css conflicts resolved
  '/delegacao/:userId': 'AuthController.delegation', //css conflicts resolved
  '/repositorio/:userId': 'AuthController.repositorio', //css conflicts still need to be resolved
  '/repositorio/create/:userId': 'AuthController.repositorioCreate', //css conflicts resolved
  '/repositorio/atualizar/:userId/:manualId': 'AuthController.atualizar',
  '/repositorio/atualizar/files/:userId/:manualId': 'AuthController.atualizarFiles',
  
  //rotas para autenticacao
  'POST /login': 'AuthController.login',
  '/logout': 'AuthController.logout',

  //rotas para engenheiros
  'GET /adm/engineer': 'EngineerController.getAll',
  'GET /adm/engineer/:id': 'EngineerController.getById',
  'POST /adm/engineer/create': 'EngineerController.create',
  'PUT /adm/engineer/update/:id': 'EngineerController.update',
  'DELETE /adm/engineer/:id': 'EngineerController.delete',

  //rotas para workers
  'GET /adm/worker': 'WorkerController.getAll',
  'GET /adm/worker/:id': 'WorkerController.getById',
  'POST /adm/worker/create': 'WorkerController.create',
  'PUT /adm/worker/update/:id': 'WorkerController.update',
  'DELETE /adm/worker/:id': 'WorkerController.delete',
  'GET /adm/worker/lines': 'WorkerController.getUniqueLines',

  //rotas para manuals
  'GET /repositorio/manual': 'ManualController.getAll',
  'GET /repositorio/manual/:id': 'ManualController.getById',
  'POST /repositorio/create/manual': 'ManualController.create',
  'PUT /repositorio/manual/update/:id': 'ManualController.update',
  'DELETE /repositorio/manual/:id': 'ManualController.delete',

  //rotas para files
  'GET /repositorio/manual/files': 'FileController.getAll',
  'POST /repositorio/manual/files/create': 'FileController.create',
  'GET /repositorio/manual/files/:manualId': 'FileController.getByManual',
  'DELETE /repositorio/manual/files/:id': 'FileController.delete',

  //rotas para delegations
  'GET /delegations': 'DelegationController.getAll',
  'GET /delegations/:id': 'DelegationController.getById',
  'POST /delegations/create': 'DelegationController.create',
  'PUT /delegations/update/:id': 'DelegationController.update',
  'DELETE /delegations/:id': 'DelegationController.delete',
  'GET /delegations/search/:workers_id': 'DelegationController.search',
  'GET /delegations/count-done': 'DelegationController.getDone',
  'GET /delegations/count-doing': 'DelegationController.getDoing',
  'GET /repositorio/delegations/:manual_id': 'DelegationController.getByManual'

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};

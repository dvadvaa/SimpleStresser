'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('index')
Route.on('/signin').render('user/login')
Route.on('/signup').render('user/register')
Route.post('/signup', 'RegisterController.create')
Route.post('/signin', 'LoginController.login')
Route.group(() => {
Route.get('/dashboard', 'HubController.main')
Route.post('/attack/new', 'AttackController.create')
Route.post('/attack/stop', 'AttackController.stop')
Route.get('/logout', 'LoginController.logout')
}).middleware(['auth'])
'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Attack extends Model {
    useServer() {
        return this.belongsTo("App/Models/Server", "server", "id")
      }
      methodInfo() {
        return this.belongsTo("App/Models/Method", "method", "id")
      }
}

module.exports = Attack

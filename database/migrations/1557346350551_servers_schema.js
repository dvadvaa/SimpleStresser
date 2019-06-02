'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServersSchema extends Schema {
  up () {
    this.create('servers', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.text('addr').notNullable()
      table.text('resource').notNullable()
      table.integer('type').notNullable()
      table.string('active', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('servers')
  }
}

module.exports = ServersSchema

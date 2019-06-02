'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MethodsSchema extends Schema {
  up () {
    this.create('methods', (table) => {
      table.increments()
      table.string('label', 255).notNullable()
      table.string('name', 255).notNullable()
      table.integer('type').notNullable()
      table.string('status', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('methods')
  }
}

module.exports = MethodsSchema

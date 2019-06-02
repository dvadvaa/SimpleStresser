'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AttacksSchema extends Schema {
  up () {
    this.create('attacks', (table) => {
      table.increments()
      table.string('user_id', 255).notNullable()
      table.string('target', 255).notNullable()
      table.integer('port').notNullable()
      table.integer('time').notNullable()
      table.integer('method').notNullable()
      table.integer('stopped').notNullable()
      table.integer('server').notNullable()
      table.integer('started_at').notNullable()
      table.integer('time_all').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('attacks')
  }
}

module.exports = AttacksSchema

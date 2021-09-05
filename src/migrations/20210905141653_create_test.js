exports.up = function(knex) {
  return knex.schema.createTable("tests", table => {
    table.increments("id").primary();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.text("url").notNullable();
    table.text("server").notNullable();
    table.decimal("download").notNullable();
    table.decimal("upload").notNullable();
    table.decimal("ping").notNullable();
    table.decimal("packetLoss").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tests");
};

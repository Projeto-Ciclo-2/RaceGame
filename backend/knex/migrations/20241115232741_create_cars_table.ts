import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("cars", function (table) {
		table.increments("id");
		table.string("name").unique().notNullable();
		table.string("unlock_requirement");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("cars");
}

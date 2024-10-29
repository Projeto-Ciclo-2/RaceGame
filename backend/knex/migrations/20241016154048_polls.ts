import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
	return knex.schema.createTable("polls", function (table) {
		table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.string("title").notNullable();
		table.string("theme").notNullable();
		table.integer("number_of_question").notNullable();
		table.integer("number_of_alternatives").notNullable();
		table.integer("duration_in_minutes").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("polls");
}

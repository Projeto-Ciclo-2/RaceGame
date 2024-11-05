import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
	await knex.schema.createTable("users", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.string("username").notNullable().unique();
		table.string("google_id").notNullable().unique();
		table.string("name").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.integer("wins").defaultTo(0);
		table.integer("messages_send").defaultTo(0);
		table.integer("picked_items").defaultTo(0);
		table.integer("played_games").defaultTo(0);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("users");
}

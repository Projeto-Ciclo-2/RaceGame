import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("users", (table) => {
		table.uuid("id").primary();
		table.string("name").notNullable().unique();
		table.string("password").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.integer("wins").defaultTo(0);
		table.integer("points").defaultTo(0);
		table.integer("medals").defaultTo(0);
		table.integer("played_polls").defaultTo(0);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("users");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.raw(`
    ALTER TABLE users
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
  `);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.raw(`
    ALTER TABLE users
    ALTER COLUMN id DROP DEFAULT;
  `);
}

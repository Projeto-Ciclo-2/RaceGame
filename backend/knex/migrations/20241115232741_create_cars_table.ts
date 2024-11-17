import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("cars", function (table) {
		table.increments("id");
		table.string("name").unique().notNullable();
		table.string("unlock_requirement");
	});
	await knex.raw(`INSERT INTO cars (name, unlock_requirement)
				VALUES
					('Green', 'Livre'),
					('Purple', 'Livre'),
					('Pink', 'Livre'),
					('Cian', '1 partida concluída'),
					('Red', '1 partida concluída'),
					('OrangeBlue', '1 partida concluída'),
					('White', '1 partida concluída'),
					('OrangeNeon', '1 vitória conquistada'),
					('Jade', '1 vitória conquistada'),
					('Amethist', '1 vitória conquistada');
				`);
	return;
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("cars");
}

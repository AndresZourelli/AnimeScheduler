import Sequalize from 'sequelize';

const sequalize = new Sequalize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	dialect: 'postgres'
});

export { sequalize };

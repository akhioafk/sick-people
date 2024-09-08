import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/**/*.ts'],
});

module.exports = AppDataSource;

import { DataSource, DataSourceOptions } from 'typeorm';
import appConfig from './index.config';
const db = appConfig().database();
export const dbdatasource: DataSourceOptions = {
  type: 'postgres',
  ssl: false,

  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  synchronize: db.synchronize,

  // logging: tue,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/src/migration/*.js'],
};
// Logger.log(dbdatasource);
const dataSource = new DataSource(dbdatasource);
export default dataSource;

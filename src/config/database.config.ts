import * as dotenv from 'dotenv';

dotenv.config();

const databaseConfig = {
  uri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/`,
};

export default databaseConfig;

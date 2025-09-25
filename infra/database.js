import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "development" ? false : true,
  });
  try {
    await client.connect();
    const result = await client.query(queryObject.text, queryObject.value);
    return result;
  } catch (error) {
    console.error("Error in query:", error);
    throw error;
  } finally {
    // aways close conexion
    await client.end();
  }
}

async function getStatsDatabase() {
  const sqlQuery = `
  SELECT 
    current_setting('server_version') as version,
    current_setting('max_connections') as max_connections,
    count(*)::int as opened_connections
  FROM pg_stat_activity WHERE datname = $1
`;

  const sqlObject = {
    text: sqlQuery,
    value: [process.env.POSTGRES_DB],
  };

  const result = await query(sqlObject);
  return result;
}

export default {
  query: query,
  getStatsDatabase: getStatsDatabase,
};

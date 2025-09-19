import database from "infra/database.js";

async function status(request, response) {
  const getStatsDatabase = await database.getStatsDatabase();
  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: getStatsDatabase.rows[0].version,
        max_connection: parseInt(getStatsDatabase.rows[0].max_connections),
        opened_connections: getStatsDatabase.rows[0].opened_connections,
      },
    },
  });
}

export default status;

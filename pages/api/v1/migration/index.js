import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

const ALLOWED_METHODS = ["POST", "GET"];

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
};

export default async function migrations(request, response) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    return response.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
      error: `METHOD: "${request.method}" not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const options = createMigrationOptions(dbClient, request.method);
    const migrations = await migrationRunner(options);

    return sendMigrationResponse(request.method, migrations, response);
  } catch (error) {
    console.error("error in migrations", error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

function createMigrationOptions(dbClient, method) {
  return {
    dbClient,
    dryRun: method === "GET",
    dir: join("infra", "migration"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

function sendMigrationResponse(method, migrations, response) {
  if (method === "POST") {
    const status = migrations.length > 0 ? HTTP_STATUS.CREATED : HTTP_STATUS.OK;
    return response.status(status).json(migrations);
  }
  return response.status(HTTP_STATUS.OK).json(migrations);
}

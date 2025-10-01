import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: request.method === "POST" ? false : true,
    dir: join("infra", "migration"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
    });

    await dbClient.end();

    migratedMigrations.length > 0
      ? response.status(201).json(migratedMigrations)
      : response.status(200).json(migratedMigrations);
    return;
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
    });

    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  response.status(405).end();
}

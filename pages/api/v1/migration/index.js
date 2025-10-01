import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const defaultMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
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

    migratedMigrations.length > 0
      ? response.status(201).json(migratedMigrations)
      : response.status(200).json(migratedMigrations);
    return;
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
    });
    return response.status(200).json(pendingMigrations);
  }

  response.status(405).end();
}

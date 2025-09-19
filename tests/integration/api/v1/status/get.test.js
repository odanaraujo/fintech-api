test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined(); // espero que o valor esteja definido

  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parsedUpdateAt);
  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connection).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBeLessThan(
    responseBody.dependencies.database.max_connection,
  );
  expect(responseBody.dependencies.database.opened_connections).not.toBeNaN();
  expect(responseBody.dependencies.database.max_connection).not.toBeNaN();
});

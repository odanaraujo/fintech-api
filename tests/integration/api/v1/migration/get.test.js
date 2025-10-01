import database from "infra/database.js";

beforeAll(async () => {
  await database.query({
    text: "drop schema public cascade; create schema public;",
    value: [],
  });
});

test("GET to /api/v1/migration should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migration");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});

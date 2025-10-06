import database from "infra/database.js";

beforeAll(async () => {
  await database.query({
    text: "drop schema public cascade; create schema public;",
    value: [],
  });
});

test("POST to /api/v1/migration should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migration", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  // create request 2
  const response2 = await fetch("http://localhost:3000/api/v1/migration", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);

  // test DELETE
  const response3 = await fetch("http://localhost:3000/api/v1/migration", {
    method: "DELETE",
  });

  expect(response3.status).toBe(405);
});

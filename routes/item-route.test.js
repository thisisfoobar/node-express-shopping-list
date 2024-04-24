process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDB");

let blueberries = { name: "Blueberries", price: 4 };

beforeEach(() => {
  items.push(blueberries);
});

afterEach(() => {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [{ name: "Blueberries", price: 4 }] });
  });
});

describe("POST /items", () => {
  test("Create new item, price as string", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Kombucha", price: "3.5" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "Kombucha", price: 3.5 } });
  });
  test("Create new item, price as num", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Chicken", price: 7 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "Chicken", price: 7 } });
  });
  test("No name given", async () => {
    const res = await request(app).post("/items").send({ price: 7 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Name and price is required" });
  });
  test("No price given", async () => {
    const res = await request(app).post("/items").send({ name: "ice cream" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Name and price is required" });
  });
  test("Price is not a number", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "cupcake", price: "ten" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Price must be a number" });
  });
});

describe("GET /items/:name", () => {
  test("Get specific item", async () => {
    const res = await request(app).get(`/items/${items[0].name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "Blueberries", price: 4 } });
  });
  test("Get specific item, invalid item", async () => {
    const res = await request(app).get("/items/Snickers");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
  test("Get inavlid item", async () => {
    const res = await request(app).delete("/items/Snickers");
    expect(res.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", () => {
  test("Update price", async () => {
    const res = await request(app)
      .patch(`/items/${items[0].name}`)
      .send({ price: 3.5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Blueberries", price: 3.5 } });
  });
  test("Update name", async () => {
    const res = await request(app)
      .patch(`/items/${items[0].name}`)
      .send({ name: "Raspberries" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Raspberries", price: 3.5 } });
  });
  test("Update name and price", async () => {
    const res = await request(app)
      .patch(`/items/${items[0].name}`)
      .send({ name: "Raspberries", price: 3.5 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Raspberries", price: 3.5 } });
  });
  test("Update inavlid item", async () => {
    const res = await request(app).delete("/items/Snickers");
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Delete Blueberries", async () => {
    const res = await request(app).delete(`/items/${items[0].name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Delete inavlid item", async () => {
    const res = await request(app).delete("/items/Snickers");
    expect(res.statusCode).toBe(404);
  });
});

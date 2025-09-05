import { Request, Response } from "express";
import { getItems, createItem } from "../src/controllers/itemController";
import { items } from "../src/models/item";
import { argv0 } from "process";

describe("Item Controller", () => {
  it("should return an empty array when no items exist", () => {
    // Create mock objects for Request, Response, and NextFunction
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Ensure that our in-memory store is empty
    items.length = 0;

    // Execute our controller function
    getItems(req, res, jest.fn());

    // Expect that res.json was called with an empty array
    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("createItem - name uniqueness", () => {
  beforeEach(() => {
    items.length = 0; // reset the in-memory store before each test
  });

  it("should return 400 if the name is already taken", () => {
    // Arrange
    items.push({ id: 1, name: "bob" }); // existing item

    const req = {
      body: { name: "bob" },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Act
    createItem(req, res, jest.fn());

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Name already taken" });
    expect(items.length).toBe(1); // still only the original item
  });
});

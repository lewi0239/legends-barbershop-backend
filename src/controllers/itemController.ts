import type { Request, Response, NextFunction } from "express";
import { items, getNextId } from "@models/item.js";
import type { Item } from "@models/item.js";

// Create an Item
export const createItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Invalid 'name' in request body" });
      return;
    }
    const newItem: Item = {
      id: getNextId(),
      name,
    };
    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

// Read All Items
export const getItems = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Update an Item
export const updateItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Invalid 'name' in request body" });
      return;
    }
    const itemIndex = items.findIndex((i: Item) => i.id === id);
    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    items[itemIndex].name = name;
    res.json(items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

// Delete an Item
export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex((i: Item) => i.id === id);
    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json(deletedItem);
  } catch (error) {
    next(error);
  }
};

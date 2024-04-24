const express = require("express");
const router = new express.Router();
const ExpressError = require("../ExpressErrors");
const items = require("../fakeDB");
const { route } = require("../app");

router.get("/", (req, res) => {
  return res.json({ items });
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name && !req.body.price)
      throw new ExpressError("Name and price is required", 400);
    const price = parseFloat(req.body.price);
    if (!price) throw new ExpressError("Price must be a number", 400);
    const newItem = { name: req.body.name, price: price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found", 404);

    return res.json({ item: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    const updated = req.body;
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found", 404);
    const objIdx = items.findIndex((item) => item.name === req.params.name);
    items[objIdx] = updated;
    return res.json({ updated });
  } catch (e) {
    return next(e);
  }
});

// router.delete("/:name", (req, res, next) => {
//   try {
//     const foundItem = items.find((item) => item.name === req.params.name);
//     if (foundItem === undefined) throw new ExpressError("Item not found", 404);
//     const objIdx = items.findIndex((item) => item.name === req.params.name);
//     items.splice(objIdx, 1);
//     return res.json({ message: "Deleted" });
//   } catch (e) {
//     return next(e);
//   }
// });

module.exports = router;

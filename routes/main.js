const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Item = require("../models/Item");
const Reservation = require("../models/Reservation");
router.get("", async (req, res) => {
  try {
    const categories = await Category.find().limit(3);
    const items = await Item.find().limit(6);
    const special = await Item.aggregate([
      { $match: { isSpecial: true } },
      { $sample: { size: 3 } },
    ]);
    res.render("index", { categories, items, special });
  } catch (error) {
    console.log(error);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categories", { categories });
  } catch (error) {
    console.log(error);
  }
});

router.get("/menus", async (req, res) => {
  try {
    const items = await Item.find();
    res.render("menus", { items });
  } catch (error) {
    console.log(error);
  }
});

router.post("/reservation", async (req, res) => {
  try {
    const { name, phone, persons, date, time, description } = req.body;
    const newReservation = new Reservation({
      name,
      phone,
      persons,
      date,
      time,
      description,
    });
    await Reservation.create(newReservation);
    res.json({newReservation});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const upload = require("../middleware/upload");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Reservation = require("../models/Reservation");

router.get("/dashboard", async (req, res) => {
  try {
    const catCount = await Category.countDocuments();
    const itemCount = await Item.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const categories = await Category.find();
    const items = await Item.find()
      .populate("category")
      .sort({ _id: -1 })
      .limit(5);
    res.render("admin/index", {
      categories,
      catCount,
      itemCount,
      reservationCount,
      items,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/addCat", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const image = "/uploads/" + req.file.filename;

    const newCategory = new Category({ name, image });
    await Category.create(newCategory);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
router.post(
  "/addItem",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      name,
      category,
      newPrice,
      oldPrice,
      description,
      seasonalItem,
      newItem,
      isSpecial,
    } = req.body;
    const image1 = req.files.image1
      ? "/uploads/" + req.files.image1[0].filename
      : "";
    const image2 = req.files.image2
      ? "/uploads/" + req.files.image2[0].filename
      : "";

    const newItems = new Item({
      name,
      category,
      newPrice,
      oldPrice,
      description,
      image1,
      image2,
      seasonalItem: seasonalItem === "on", // checkbox values
      newItem: newItem === "on",
      isSpecial: isSpecial === "on",
    });
    await Item.create(newItems);
    res.redirect("/dashboard");
  }
);

router.get("/addNew", async (req, res) => {
  try {
    res.render("admin/addNew", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/addCat", async (req, res) => {
  try {
    res.render("admin/addCat", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/addItem", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/addItem", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/categoryAdmin", async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });
    res.render("admin/categoryAdmin", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/itemsAdmin", async (req, res) => {
  try {
    const items = await Item.find().populate("category").sort({ _id: -1 });
    res.render("admin/itemAdmin", { items, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/reservationAdmin", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("admin/reservations", { reservations, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/blogAdmin", async (req, res) => {
  try {
    res.render("admin/blog", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-cat/:id", async (req, res) => {
  try {
    const categories = await Category.findOne({ _id: req.params.id });
    res.render("admin/editCat", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// EDIT CATEGORY ROUTE
router.put("/edit-cat/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    const updatedData = { name };

    if (req.file) {
      updatedData.image = "/uploads/" + req.file.filename;
    }

    await Category.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect("/categoryAdmin");
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).send("Update failed.");
  }
});

router.get("/edit-item/:id", async (req, res) => {
  try {
    const categories = await Category.find();
    const items = await Item.findOne({ _id: req.params.id });
    res.render("admin/editItem", { categories, items, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/edit-item/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        category,
        newPrice,
        oldPrice,
        description,
        seasonalItem,
        newItem,
        isSpecial,
      } = req.body;

      const updatedData = {
        name,
        category,
        newPrice,
        oldPrice,
        description,
        seasonalItem: seasonalItem === "on", // checkbox values
        newItem: newItem === "on",
        isSpecial: isSpecial === "on",
      };
      if (req.files.image1) {
        updatedData.image1 = "/uploads/" + req.files.image1[0].filename;
      }
      if (req.files.image2) {
        updatedData.image2 = "/uploads/" + req.files.image2[0].filename;
      }
      await Item.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect("/itemsAdmin");
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete("/delete-cat/:id", async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;

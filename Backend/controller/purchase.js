const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");
const xlsx = require('xlsx');
const Product = require('../models/Product');

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: req.body.purchaseDate,
    Cost:req.body.Cost,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      purchaseStock(req.body.productID, req.body.quantityPurchased);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

//add purchases via excel
const addExcelPurchase = async (req, res) => {
  const excelData = req.body;
  console.log("Received Excel Data:", excelData);

  try {
    for (const purchaseData of excelData) {
      const purchase = new Purchase({
        userId: purchaseData.userId, // Assuming userID is obtained from the request
        Product: purchaseData.name,
        QuantityPurchased: purchaseData.quantity,
        Cost:purchaseData.cost,
      });
      await purchase.save();
    }
    res.status(200).json({ message: "Purchases added successfully." });
  } catch (error) {
    console.error("Error adding purchases from Excel:", error);
    res.status(500).json({ error: "An error occurred while adding purchases." });
  }
};
// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Purchase.find({
    userID: req.params.userID,
  })
  .sort({ _id: -1 })
    .populate("ProductID"); // -1 for descending order
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({"userID": req.params.userID});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });
  res.json({ totalPurchaseAmount });
};

module.exports = { addPurchase, getPurchaseData, addExcelPurchase , getTotalPurchaseAmount };

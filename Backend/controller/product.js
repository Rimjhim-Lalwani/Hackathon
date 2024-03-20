
const Product = require("../models/Product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
// Add Post
const addProduct = (req, res) => {
  console.log("req: ", req.body.userId);
  const addProduct = new Product({
    userID: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    stock: req.body.stock,
    description: req.body.description,
  });

  addProduct
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};
//add products via excel
const addFromExcel = async (req, res) => {
  const excelData = req.body;
  console.log("Received Excel Data:", excelData);

  try {
    
    for (const productData of excelData) {
      console.log("Product Data:", productData.userId);
      // Create a new Product object
      const newProduct = new Product({
        userId:productData.userId,
        name: productData.name,
        manufacturer: productData.manufacturer,
        stock: productData.stock,
        description: productData.description,
      });

      // Save the product to the database
      await newProduct.save();
    }

    // Send a success response
    res.status(200).json({ message: "Products added successfully." });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error adding products from Excel:", error);
    res.status(500).json({ error: "An error occurred while adding products." });
  }
};
// Get All Products
const getAllProducts = async (req, res) => {
  const findAllProducts = await Product.find({
    userID: req.params.userID,
  }).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllProducts);
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const deleteProduct = await Product.deleteOne(
    { _id: req.params.id }
  );
  const deletePurchaseProduct = await Purchase.deleteOne(
    { ProductID: req.params.id }
  );

  const deleteSaleProduct = await Sales.deleteOne(
    { ProductID: req.params.id }
  );
  res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        stock:req.body.stock,
        description: req.body.description,
      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  addFromExcel
};

const Sales = require("../models/sales");
const Product = require("../models/Product");

const SalesStock = async (productID, StockSold) => {
  
  try {
    const myProductData = await Product.findOne({ _id: productID });
    let myUpdatedStock = parseInt(myProductData.stock) - StockSold;

    const SalesStock = await Product.findByIdAndUpdate(
      { _id: productID },
      {
        stock: myUpdatedStock,
      },
      { new: true }
    );
    console.log(SalesStock);
  } catch (error) {
    console.error("Error updating Sales stock ", error);
  }
};

module.exports = SalesStock;
const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");

// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    SoldAt:req.body.SoldAt
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productID, req.body.stockSold);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};
const getRecentSalesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the two most recent sales of the specified product
    const recentSales = await Sales.find({ ProductID: productId })
    
      .sort({ SaleDate: -1 }) // Sort by SaleDate in descending order
      .limit(2); // Limit the results to two
      console.log(recentSales);
      const salesArray = recentSales.map(sale => ({
        StockSold: sale.StockSold,
      }));
  
      res.status(200).send(salesArray);
  } catch (error) {
    console.error('Error fetching recent sales by product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({userID: req.params.userID})
    .sort({ _id: -1 })
    .populate("ProductID");
   // -1 for descending order
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async(req,res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({"userID": req.params.userID});
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.TotalSaleAmount;
  })
  res.json({totalSaleAmount});

}



module.exports = { addSales, getSalesData, getRecentSalesByProduct, getTotalSalesAmount};

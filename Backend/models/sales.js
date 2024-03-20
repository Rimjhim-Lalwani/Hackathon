const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
     
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      
    },
    StockSold: {
      type: Number,
      required: true,
    },
    SoldAt: {
      type: Number,
      required: true,
    },
    SaleDate: {
      type: String,
      required: true,
    },
    TotalSaleAmount: {
      type: Number,
      
    },
  },
  { timestamps: true }
);
SaleSchema.pre('save', function(next) {
  this.TotalSaleAmount = this.SoldAt * this.StockSold;
  next();
});
const Sales = mongoose.model("sales", SaleSchema);
module.exports = Sales;

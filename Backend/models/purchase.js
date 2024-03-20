const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      
    },
    Product:{
      type:String
    },
    QuantityPurchased: {
      type: Number,
      required: true,
    },
    PurchaseDate: {
      type: String
     
    },
    Cost: {
      type: Number,
      required: true,
    },
    TotalPurchaseAmount: {
      type: Number},
  },
  { timestamps: true }
);
PurchaseSchema.pre('save', function(next) {
  this.TotalPurchaseAmount = this.Cost * this.QuantityPurchased;
  next();
});
const Purchase = mongoose.model("purchase", PurchaseSchema);
module.exports = Purchase;

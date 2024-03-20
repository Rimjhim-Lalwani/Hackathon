const mongoose = require("mongoose");
const uri = "mongodb+srv://rimjhim:1234@inventory.hpkeopt.mongodb.net/?retryWrites=true&w=majority&appName=inventory";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };
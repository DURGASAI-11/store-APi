// If we hava a data of products but its in json file not in database
// inorder to post this all products data one after another using post route takes too long
// so we dynimically populate using this file
// lets see how we can do it

//Setps to follow
//1) make connection with dotenv file because we using "MONGO_URI" to connect with DB
//2) To make use of "MONG_URI" we need to use associated function "connectDB" so import that file too
//3) we need to add some products which are in "products.json" so import them too
//4)create a async function which is
//
require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");
const jsonProducts = require("./products.json");
// const  = fs.readFileSync(jsonProducts, "utf - 8");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

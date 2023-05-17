const Product = require("../models/product");
//
//In the below controller (getAllProductsStatic) i have learned = How we can sort("name price") and select("company createdAt")
// but we need to hard code the things here (we need to mention what ever we want but no user can get what they want this is predefined)
//
module.exports.getAllProductsStatic = async (req, res) => {
  const search = "aB";
  const products = await Product.find({ price: { $gte: 30 } })
    .sort("price")
    .select("name price createdAt")
    .limit(10)
    .skip(1);
  res.status(200).json({ items: products.length, products });
};

//
//IN the below controller (getAllProducts) we destructring the req.query so
// we can get know what user expecting to search then those values mathes the restric free data
// in our application the we can access the
// we need to chain the sort().select().limit().skip() etcc.. to the asynchronous function
// Then we can wait that "  let result = Product.find(queryObject);" after  chaining them all we can await like this   const products = await result;
//
module.exports.getAllProducts = async (req, res) => {
  // console.log(req.query);{
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  // console.log(queryObject);
  let result = Product.find(queryObject);
  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  //select
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  if (numericFilters) {
    //if numericFilters present
    const operatorMap = {
      //it mongodb understandable language converter
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g; // regex which matches the symbols
    let filters = numericFilters.replace(
      //it replace any  regEx match with the numericFilters
      regEx,
      (match) => `-${operatorMap[match]}-` //here it matches > so it converts to -$gt-, and >= mathces this-$gte-
    );
    //after this it transforsm this "price>40,rating>=4" to this "price-$gt-40,rating-$gte-4"
    console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      console.log(filters);
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  //23 = total product i have
  //4pages limit7= 7 7 7 2

  const products = await result;
  res.status(200).json({ items: products.length, products });
};

const passport = require('passport');
const db = require('../db')
const XLSX = require("xlsx");
const jwt = require('jsonwebtoken');
const secret = process.env.secret;
const axios = require('axios');

module.exports.getProduct = async function(req, res) {

  const {nameProduct, descriptionProduct} = req.query
  const authHeader = req.headers.authorization;
  console.log('queryName - ' + req.query);
  
  let whereText    = ''
  let whereHidden = ''
  let text = 'Select * from products'
  
  if (nameProduct) {
  
    whereText = ` where name like '%${nameProduct}%'` 
  }

  if (descriptionProduct) {
    
    let whereDescription = (` description like '%${descriptionProduct}%'`)
    if (!whereText) {
      
      whereText = ` where ${whereDescription}`   
    } else {

      whereText = (whereText + ` and ${whereDescription}`)   
    }  
      
  }

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    
    try { 
      let decoded = jwt.verify(token, secret);
    } catch(err) {
      whereHidden = ' hidden = false'      
    }                 
  } else {
    
    whereHidden = ' hidden = false'   
  }

  if (whereHidden) {

    if (whereText) {
      
      whereText = (whereText + ` and ${whereHidden}`)   
    }else{
      
      whereText = (whereText + ` where ${whereHidden}`)         
    }        
  }

  if (whereText) {
    text = (text + whereText)
  }
  
  try {
   
    const allProducts = await db.query(text)
    const findProducts =  allProducts.rows
    res.status(200).json({
      findProducts
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(500).json({
      error: err.stack
    });
  }
}

module.exports.getByCategoryId = async function(req, res) {
  
  categoryId = req.params.categoryId;
  let text = `SELECT * FROM products WHERE id in ( SELECT product_id FROM category_product WHERE category_id = '${categoryId}')`
  try {
   
    const allProducts = await db.query(text)
    const findProducts =  allProducts.rows
    res.status(200).json({
      findProducts
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(500).json({
      error: err.stack
    });
  }
  
}

module.exports.remove = async function(req, res) {
  
  const text = 'DELETE FROM products WHERE id = $1'
  const values = [req.params.id]  
  try {
   
    const removeProduct = await db.query(text, values)
    res.status(200).json({
      Text: "Product removed - " + values
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}

module.exports.create = async function(req, res) {
  
  const {name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, categories} = req.body;
  const text = 'INSERT INTO products (name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
  const values = [name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden]
  
  try {
   
    const newProduct = await db.query(text, values)
    const createProduct =  newProduct.rows[0]
   
    if (categories) {
      const arrayCategories = categories.split(',')
      
      for (index = 0; index < arrayCategories.length; ++index) {

        let textCategory_product = 'INSERT INTO category_product(category_id, product_id) VALUES($1, $2) RETURNING *'
        let valuesCategory_product = [arrayCategories[index], createProduct.id]
        let newCategory_product = await db.query(textCategory_product, valuesCategory_product)       
      }      
    }

    res.status(200).json({
      createProduct   
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(500).json({
      error: err.stack
    });
  }
}

module.exports.update = async function(req, res) {
  
  const {name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, categories, barcode} = req.body;
  const text = `UPDATE products SET name = $1, description = $2, name_en = $3, description_en = $4,  name_ru = $5, description_ru = $6,
                status = $7, price = $8, discount = $9, hidden = $10, barcode = $11 WHERE id = $12`
  const values = [name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, barcode, req.params.id]

  try {
   
    const updateProduct = await db.query(text, values)
    const Product       =  updateProduct.rows

    res.status(200).json({
      Product   
   })
  } catch (err) {
  
   // console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}

module.exports.upload = async function(req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    
    return res.status(400).send('No files were uploaded.');
  }
  
  let textquery = ''
  let values =''
  let insertProduct = 0
  let updateProduct = 0
  
  const workbook = XLSX.read(req.files.products.data);
  const ws       = workbook.Sheets["Sheet1"];
  const result= XLSX.utils.sheet_to_json(ws);

  let arrId = []

  for (index = 0; index < result.length; ++index) {

    arrId.push(result[index].id)    
  } 
  
  let text = `Select id from products where id in (${arrId})`
 
  const findID = await db.query(text)
  const findProducts =  findID.rows

  for (index = 0; index < result.length; ++index) {

    let idExel = result[index].id
    let isId = findProducts.filter(function(val) {
      return val.id == idExel;
    })[0];
   
    let {id, name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, categories, barcode} = result[index];
    
    if (isId) {
      textquery = `UPDATE products SET name = $1, description = $2, name_en = $3, description_en = $4,  name_ru = $5, description_ru = $6,
                status = $7, price = $8, discount = $9, hidden = $10, barcode = $11 WHERE id = $12`
      values = [name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, barcode, id]
      updateProduct++
    } else {
      textquery = `INSERT INTO products (name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, barcode) 
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`
      values = [name, description, name_en, description_en, name_ru, description_ru, status, price, discount, hidden, barcode]      
      
      insertProduct ++
    }
    
    try { 
      const createUpdateProduct = await db.query(textquery, values)
    } catch (err) {
     
      res.status(400).json({
      error: err.stack
    })}
  } 

  res.status(200).json({
   "Insert product": insertProduct,
   "Update product": updateProduct
  })  
}




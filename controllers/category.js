const db = require('../db')

module.exports.getAll = async function(req, res) {

  const text = 'Select * from categories'
    
  try {
   
    const AllCategories = await db.query(text)
    const findCategories =  AllCategories.rows
    res.status(200).json({
      findCategories
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}

module.exports.remove = async function(req, res) {
  
  const text = 'DELETE FROM categories WHERE id = $1'
  const values = [req.params.id]  
  try {
   
    const removeCategories = await db.query(text, values)
    res.status(200).json({
         Text: "Category removed - " + values
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}

module.exports.create = async function(req, res) {
  
  const {name, name_en, name_ru, parent_id} = req.body;
  const text = 'INSERT INTO categories (name, name_en, name_ru, parent_id) VALUES($1, $2, $3, $4) RETURNING *'
  const values = [name, name_en, name_ru, parent_id]
  
  try {
   
    const newCategories = await db.query(text, values)
    const createCategories =  newCategories.rows
    res.status(200).json({
      createCategories   
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}

module.exports.update = async function(req, res) {
 
  const {name, name_en, name_ru, parent_id, id} = req.body;
  const text = `UPDATE categories SET name = $1, name_en = $2, name_ru = $3, parent_id = $4 WHERE id = $5`
  const values = [name, name_en, name_ru, parent_id, req.params.id]

  console.log(req.params.id);
  
  try {
   
    const newCategories = await db.query(text, values)
    const updateCategories =  newCategories.rows
    res.status(200).json({
      updateCategories   
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}
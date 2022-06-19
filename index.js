require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const passport = require("passport");
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const fs = require('fs')

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');


const port = process.env.port || 5000;

app.use(express.urlencoded({ extended: true }))//app.use(express.urlencoded);
app.use(express.json());
app.use(passport.initialize())

app.use(fileUpload({}));
app.use(express.static('public'));

require('../Auth-Catalog/middleware/passport')(passport)

const options = {
  definition: {
    info: {
      title: 'App',
      description:"Test app for Asta-mobi "     
    },
    servers: ["http://localhost:" + port]
  },  
  apis: [__filename]  
};

const openapiSpecification = swaggerJsDoc(options);

const swaggerFile = JSON.parse(fs.readFileSync('swagger.json'))
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))

//routes
/** 
 * @swagger 
 * /api/auth:
 *   post: 
 *     description: Get all Employee by Email * 
 *     parameters:
 *        User, password
 *     responses:  
 *       200: 
 *         description: Success  
 *       400: 
 *         description: bed reuest  
 *   
 */

app.use('/api/auth'    , authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product' , productRoutes);

app.listen(port, () =>{
  console.log('Server works on port - ' + port)
})
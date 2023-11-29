const express = require('express')
const dotenv = require("dotenv")
const morgan = require("morgan")
const dbconnection = require('./config/database');


dotenv.config({path: 'config.env'})

const ApiError = require('./utils/apiError');
const globalError = require('./middlware/errmiddlware')
const brandRoute = require('./router/brandRoute')
const categoryRoute = require('./router/catroter');
const subCategoryRoute = require('./router/subcat');
const productRoute = require('./router/productRote');

const app = express();
dbconnection();
app.use(express.json());



if(process.env.NODE_ENV === 'devlopment') {
    app.use(morgan('dev'));
    console.log(`node : ${process.env.NODE_ENV}`)
}

app.get('/',(req,res) => {
    res.send("aaaaaaaaa");
})
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);

app.all('*',(req,res,next) => {
   next(new ApiError(`can t find this route : ${req.originalUrl}`, 400))
})

app.use(globalError)

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT , () => {
    console.log(`App running on port :${PORT}`);
})

process.on(`unhandledRejection`,(err) =>{
    console.error(`UnhandledRejection Error : ${err.name} | ${err.massage}`);
    server.close(( ) => {
        console.error('shutting down...');
        process.exit(1);

    });
    
});
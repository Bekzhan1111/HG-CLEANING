
const  express= require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyparser= require('body-parser')
const https=require('https')
const {response} = require("express");
const methodOverride = require('method-override')
const UserRoute = require('./routes/User.js');


// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const SwaggerOptions = require('./swagger.json');
const swaggerDocument = swaggerJsDoc(SwaggerOptions);
const {router} = require("express/lib/application");
const app = express();
app.use(express.json())
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader("Access-Control-Allow-Methods",'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers",'Content-Type,Authorization');
    next();
})

app.use('/api', UserRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message:message});
})




const bodyParser=require("body-parser");
const ejs=require("ejs");

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});












app.use(express.static('/'))


app.use(express.static('/'))
app.use(bodyParser.urlencoded({extended: true}))




app.use('/js',express.static(__dirname+'/js'))
app.use('/img',express.static(__dirname+'/img'))
app.use('/css',express.static(__dirname+'/css'))

app.use('/about', require('./routes/about.js'))
app.use('/contact', require('./routes/contact.js'))
app.use('/', require('./routes/index.js'))
app.use('/portfolio', require('./routes/portfolio.js'))
app.use('/service', require('./routes/service.js'))
app.use('/weather', require('./routes/weather.js'))
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));


app.get('/', (req, res) => {
    res.render('index');
});



app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});
app.get('/service', (req, res) => {
    res.render('service');
});


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/views/index.ejs')
})
// app.post('/',((req, res) =>{
//     let cityname=req.body.city
//     let key="d134b1b82bb2a01099550a3393edb5"
//     let url="https://api.openweathermap.org/data/2.5/weather?q=" +cityname + "&appid=" + key + "&units=metric&mode=json"
//     https.get(url,function (response){
//         response.on( 'data',data=>{
//             // console.log(data)
//             let a= JSON.parse(data)
//             let temp= a.main.temp
//             let cond= a.weather[0].description
//             res.send("Weather in city:"+ cityname + "  "+cond+"  "+temp)
//         })
//
//     })
//
// } ))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});







app.use('/user', UserRoute)

const UserModel = require('./models/user')

app.post('/',function (req ,res){
    let newUser=new UserModel({
        yourName: req.body.yourName,
        number:req.body.number,
        comment:req.body.comment,
        service:req.body.service,
        email:req.body.email,
        // Placement:req.body.Placement,
        // Date:req.body.Date,
        // time:req.body.Time,
        // Note:req.body.Note,
    })
    newUser.save();
    res.redirect("/")
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})




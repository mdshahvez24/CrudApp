//14/09/
const express = require ("express")
const path = require("path")
const hbs = require("hbs")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
dotenv.config()

require("./db.connect")
const Employee = require("./models/Employee")

// const user = require('./models/Employee')
const app = express()

app.use(express.static(path.join(__dirname,"./views")))
app.set("view engine","hbs")
hbs.registerPartials(path.join(__dirname,"./views/partials"))



const encoder = bodyParser.urlencoded({ extended: true });

app.get("/",async(req,res)=>{
    try{
        const data = await Employee.find()
        console.log(data)
        res.render("index",{'data':data})
    }
    catch(error){
        console.log(error)
        console.log("Internal Server Error")
    }
})
app.get("/add",(req,res)=>{
    res.render("add")
})
app.post("/add",encoder,async(req,res)=>{
    try{
        const data = new Employee(req.body)
        await data.save()
        res.redirect("/")
    }
    catch(error){
        console.log("Internal Server Error");
    }
})
app.get("/delete/:_id", async(req,res)=>{
    try{
        const data= await Employee.deleteOne({_id:req.params._id})
        res.redirect("/")
    }
    catch(error){
        console.log(error)
        res.render("/")
    }
});

app.get("/update/:_id",async(req,res)=>{
    try{
        const data = await Employee.findOne({_id:req.params._id})
        res.render("update",{'data':data})
    }
    catch(error){
        console.log(error);
        res.redirect("/")
    }
})
app.post("/update/:_id",encoder,async(req,res)=>{
    try{
        const data = await Employee.findOne({_id:req.params._id})
        data.name = req.body.name??data.name
        data.dsg = req.body.dsg??data.dsg
        data.salary = req.body.salary??data.salary
        data.city = req.body.city??data.city
        data.state = req.body.state??data.state
        await data.save()
        res.redirect("/")
    }
    catch(error){
        console.log(error);
        res.redirect("/")
    }
})
app.post("/search",encoder,async(req,res)=>{
    try{
        const data = await Employee.find({$or:[
            {name:{$regex:`.*${req.body.search}.*`,$options:"i"}},
            {dsg:{$regex:`.*${req.body.search}.*`,$options:"i"}},
            {city:{$regex:`.*${req.body.search}.*`,$options:"i"}},
            {state:{$regex:`.*${req.body.search}.*`,$options:"i"}}
        ]})
        console.log(data);
        res.render("index",{'data':data})
    }
    catch(error){
        console.log(error)
        res.redirect('/')
    }
})


let PORT = process.env.PORT|8200
app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`)
})
let express = require('express');

let app = express();
let dotenv = require('dotenv')
dotenv.config()
// let port = 7800;
let port = process.env.PORT||7800 //if different port number use 
let mongo = require('mongodb')
let MongoClient = mongo.MongoClient;
// let Mongourl = process.env.MongoURL; for the local api
let mongoUrl = process.env.LiveMongo; //for live mongodb
//  let MongoURL = 'mongodb://localhost:27017';
// let MongoURL = 'mongodb://127.0.0.1:27017';

let db;

let bodyParser = require('body-parser')// for POST api
  app.get('/',(req,res) =>{
    res.send("hi to express")
  })
// update Order(PUT)

  //api for location

app.get('/location',(req,res) =>{
    
    db.collection('location').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//middleware for the bodyparser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
// placeorder
app.post('/placeOrder',(req,res) =>{
    db.collection('orders').insert(req.body,(err,result) =>{
        if(err) throw err
        res.send('order Placed')
    })
})

// updateOrder(PUT)
app.put('/updateOrder/:id',(req,res) =>{
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
        //  import cors
        {id:oid},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date

            }
        },(err,result) =>{
            if(err) throw err;
            res.send('order Placed')
        }
    )

})

// DElete order(DELETE/REMOVE)
app.delete('/deleteOrder/:id',(req,res) =>{
    let _id = mongo.ObjectId(req.params._id)
    db.collection('orders').remove({_id:_id},(err,result) =>{
        if(err) throw err
        res.send('order deleted')
    })
})


// MENU DETAIL(POST)
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.post('/menuItem',(req,res) =>{
// check wheather it is an ARRAY
    if(Array.isArray(req.body.id)){
        db.collection('menu').find({menu_id:{$in:req.body.id}}).toArray((err,result) =>{
            if(err) throw err
            res.send(result)
        })
    }else{
        res.send("Invalid Input")
    }
})

// delete

// details of restaurant with dfferent api
// app.get('/details/:restId',(req,res) =>{
//     let restId = Number(req.params.restId)
//     db.collection('restaurant').find({restaurant_id:restId}).toArray((err,result) =>{
//         if(err) throw err
//         res.send(result)
//     })

// })
// Menu of the restaurant
app.get('/menu/:id',(req,res) =>{
    let id = Number(req.params.id)
    db.collection('menu').find({restaurant_id:id}).toArray((err,result) =>{
        if(err) throw err
        res.send(result)
    })

})


// api for orders
app.get('/orders',(req,res) =>{
    let email = req.query.email;
    // let email = req.query;
    let query = {}
    if(email){
        query = {email:email}
        // query = {email}

    }else{
        query = {}

    }
    db.collection('orders').find().toArray((err,result) =>{
        if(err) throw err
        res.send(result)
        
    })
})




// list/api for restaurant

// app.get('/restaurant',(req,res) =>{
//     db.collection('restaurant').find().toArray((err,result) =>{
//         if(err) throw err;
//         res.send(result)
//     })
// })

// to make use of params ie state_id 

// app.get('/restaurant/:state_id',(req,res) =>{
// localhost:9800/restaurant/1 is given then it works,if we don't need to give value
// let state_id = Number(req.params.state_id) //always url returns string SO convert it to Number

//     db.collection('restaurant').find({state_id:state_id}).toArray((err,result) =>{
//         if(err) throw err;
//         res.send(result)
//     })
// })

// now queryParams
// ********************
app.get('/restaurant',(req,res) =>{
    let stateId = Number((req.query.stateId))
    let query = {}
    if(stateId){
        query = {state_id:stateId}
    }else{
        query = {}
    }
    
    db.collection('restaurant').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

 //api for mealType
//  app.get('/mealType',(req,res) =>{
//     db.collection('mealType').find().toArray((err,result) =>{
//         if(err) throw err;
//         res.send(result)
//     })
//  })

//  api for mealTypes with mealtpe_id
// app.get('/mealType',(req,res) =>{
//     let mealId = Number(req.query.mealId)
//     let query = {}
//     if(stateId){
//         query ={state_id:stateId}

//     }else if(mealId){
//         query = {"mealTypes.mealtype_id":mealId}
//     }else{
//         query = {}
//     }

//     db.collection('mealType').finf(query).toArray((err,result) =>{
//         if(err) throw err;
//         res.send(result)
//     })
    
// })

// restuarant wrt meal & cuisine
// restuarant wrt meal & cost [ie meal is compulsory cuisine is optional So we USE FILTER API]

// app.get('/filter/:mealId',(req,res) =>{
//     let query = {}
//     let mealId = Number(req.params.mealId)
//     let cuisineId = Number(req.query.cuisineId)
//         if(cuisineId){
//             query = {
//                 "mealTypes.mealtype_id":mealId,
//                 "cuisines.cuisine_id":cuisineId
//             }
//         }else{
//             query = {
//                 "mealTypes.mealtype_id":mealId
//             }
//         }
//         db.collection('restaurant').find(query).toArray((err,result) =>{
//             if(err) throw err;
//             res.send(result)
//         })
// })

// restaurant wrt meal & cost for high & low cost
app.get('/filter/:mealId',(req,res) =>{
    let query = {}

    let sort = {cost:1}
    let mealId = Number(req.params.mealId);
    let cuisineId =Number(req.query.cuisineId)
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    // this sort condition  will work with  all
    if(req.query.sort){
        sort = {cost:req.query.sort}
    }
    else if(hcost && lcost){
        console.log('hcost:',hcost)
        query = {
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }else if(cuisineId){
        query = {
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId
        }
    }else{
        query = {
            "mallTypes.mealId":mealId
        }
    }
    db.collection('restaurant').find(query).sort(sort).toArray((err,result) =>{

        if(err) throw err;
        res.send(result)
    })
})

// connection with db
    //  MongoClient.connect (MongoURL,(err,client) =>{
    //         if(err) console.log('Error while connecting')
            // db = client.db('raju')// db with we created in mongo and local  
            //   db = client.db('Aug_22');
            // now server to listen
    //             app.listen(port,()=>{
    //             console.log(`server is running on  port${port}`)
    // })
    

    //     })

    MongoClient.connect(mongoUrl,(err,client) => {
        if(err) console.log('Error while connecting');
        db = client.db('Oct_28');
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`)
        })
        })
    


       


        




      
     

    





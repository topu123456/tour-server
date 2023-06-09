const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
//middlewares
app.use(cors());
app.use(express.json())


console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dzfwzfk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
try{
     const serviceCollection=client.db('DreamTour').collection('services');
     const reviewCollection=client.db('DreamTour').collection('reviews')

     app.get('/services',async(req,res)=>{
        const query={}
        const cursor=serviceCollection.find(query);
        const services=await cursor.toArray();
        res.send(services);
     })


//post

app.post('/services',async(req,res)=>{
    const service=req.body;
    const result=await serviceCollection.insertOne(service)
    res.send(result) 
})


//services review
app.get('/services/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)};
    const service= await serviceCollection.findOne(query)
    res.send(service);
})

//review api


//reviewshow
app.get('/reviews',async(req,res)=>{
    
    let query={}
    if(req.query.email){
        query={
            email:req.query.email
        }
    }
    cursor=reviewCollection.find(query);
    const reviews= await cursor.toArray()
    res.send(reviews);
})




app.post('/reviews',async(req,res)=>{
    const review=req.body;
    const result =await reviewCollection.insertOne(review);
    res.send(result);
})

app.patch('/reviews/:id',async(req,res)=>{
    const id= req.params.id;
    const status=req.body.status
    const query={_id:ObjectId(id)};
    const updatedoc={
      $set:{
          status:status
      }  
    }
    const result=await reviewCollection.updateOne(query,updatedoc)
    res.send(result)
})

app.delete('/reviews/:id',async(req,res)=>{
    const id =req.params.id;
    const query={_id: ObjectId(id)};
     const result=await reviewCollection.deleteOne(query);
     res.send(result);
 })

}
finally{

}
}
run().catch(err=>console.log(err))



app.get('/',(req,res)=>{
    res.send('tour server is running')
})

app.listen(port,()=>{
    console.log(`tour server is running on${port}`);
})
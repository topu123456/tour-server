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
     const reviewCollection=client.db('DreamTour').collection('review')

     app.get('/services',async(req,res)=>{
        const query={}
        const cursor=serviceCollection.find(query);
        const services=await cursor.toArray();
        res.send(services);
     })

//services review
app.get('/services/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)};
    const service= await serviceCollection.findOne(query)
    res.send(service);
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
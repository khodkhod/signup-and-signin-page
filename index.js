
const express = require('express');
const app = express();
const port = 3001;
const mongoose=require("mongoose")

app.set('view engine','ejs');

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
console.log("Database connected");
let URI="mongodb+srv://tech_hijabie:Ayomiku07@cluster0.4is8ejc.mongodb.net/mydata?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(URI).then(()=>{
  console.log(("Database connected"));
  }).catch((err)=>{
      console.log("Database could not connect");
      console.log(err);
  })
  const userSchema=mongoose.Schema({
      firstName:{type:String,required:true},
      secondName:{type:String,required:true},
      password:{type:String,required:true},
      email:{type:String,unique:true},
  })
  
  let userModel=mongoose.model("User",userSchema)
  


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
// app.post(('/signin'),(req,res)=>{
//   console.log("i am working");
// })
app.get('/signin',(req,res)=>{
    res.render('signin')
});
// app.get('/dashboard',(req,res)=>{
//     res.render('dashboard')
// });
app.post('/signin',(req,res)=>{

  let {email, password} = req.body;
  userModel.findOne({email:email, password:password})
  .then((users) =>{
    // if(users){
    //   console.log("user confirmed:",users);
      res.redirect(`/dashboard?email=${users.email}`)
      console.log(users);
    // }
    // else{
    //   console.log('not found');
    //   res.send('Invalid email or password.else error')
    // }
  })
  .catch(err =>{
    console.log("err login user in",err);
    res.send('invalid email or password. catch error')
  })
})

app.get('/signup',(req,res)=>{
    res.render('signup')
});


app.post(('/signup'),(req,res)=>{

  // console.log("i am working");
  let user = new userModel(req.body)
  user.save()
  .then(()=>{
    console.log('saved new user:', req.body);
    res.redirect('/signin')
  })
  .catch(err =>{
    console.log('user not saved:', err);
  })
});
app.get('/dashboard', (req,res) =>{
  let email = req.query.email
  console.log(email);
  userModel.find({ email})
       .then(userDetails => {
            // Render the dashboard view and pass user details as data
           res.render('dashboard', {userDetails: email});
       })
       .catch(err => {
           console.error('Error fetching user details:', err);
           res.status(500).send('Internal Server Error');
       });
})
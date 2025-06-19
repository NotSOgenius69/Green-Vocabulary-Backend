const express = require('express');
const authRoutes = require('./routers/authRouter')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Word = require('./schemas/wordSchema');
const User = require('./schemas/userSchema');
const auth = require('./middlewares/authMiddleware')

const app = express();
const port=process.env.PORT || 5000;

//Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}
));
app.use(express.json());
app.use('/auth',authRoutes);

//Connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Database Connected'))
.catch((err)=>console.log('There was problem while connecting to mongo',err));

//Basic Routes
app.post('/add-new',async (req,res) => {
   try
   {
    let {english,bangla} = req.body;
    //console.log("Recieved data:",{english,bangla});

    english=english.trim().toLowerCase();
    bangla=bangla.trim();

    const newWord = new Word({firstletter:english.charAt(0),english,bangla});
    await newWord.save()

    res.status(200).json({message:"New words added successfully"});

   }catch(error){
    res.status(500).json({message:"There was a server side error!"});
   }
});

app.get('/learn', async(req,res) =>{
    try {
        const words = await Word.find().sort({ firstletter: 1 }).limit(50);
        res.status(200).json({ 
            success:true,
            message: "Retrieve successful",
            data: words
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "There was a server side error!",
            error: error.message
        });
    }
});

app.get('/test',auth, async(req,res) =>{
     try {
        const limit = parseInt(req.query.limit);
        const user = await User.findById(req.userId);
        let skipWords = user.tested;
        const totalWords = await Word.countDocuments();

        if(skipWords>=totalWords)
        {
            skipWords = 0;
            await User.findByIdAndUpdate(req.userId,
            {
                $set : { tested : skipWords }
            }
        );
        }
        const words = await Word.find().sort({ firstletter: 1 }).limit(limit).skip(skipWords);

        await User.findByIdAndUpdate(req.userId,
            {
                $inc : { tested : limit }
            }
        );
        res.status(200).json({ 
            success:true,
            message: "Retrieve successful",
            data: words
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: "There was a server side error!",
            error: error.message
        });
    }
});

app.listen(port,'0.0.0.0',
    () => console.log(`Server listening on port ${port}`)
);
const mongoose = require('mongoose');

const wordSchema = mongoose.Schema({
    firstletter:{
        type:String,
        maxlength:1,
        index:true
    },
    english:{
        type:String,
        required:true
    },
    bangla:{
        type:String,
        required:true
    }
});

const Word = new mongoose.model('Word',wordSchema);
module.exports = Word;
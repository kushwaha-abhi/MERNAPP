const mongoose= require('mongoose');

const productSchema= mongoose.Schema({
    name:{
        type:String,
        require:[true, 'Please Enter Product Tupe'],
        trim:true
    },
    description:{
        type:String,
        require:[true, 'Please enter Description']
    },
    price:{
        type:Number,
        required:[true, 'Please enter Price of Product'],
        maxLength:[8 , 'price can not exceed eight figures']
    },
 
    rating:{
        type:Number,
        default:0
    },

    images:[
        {
            public_id:{
                type:String,
                required:true,
            } ,
            url:{
                type:String,
                required:true,
            }  
        }
    ],
    category:{
        type:String,
        required:[true, ' Please enter Product category'],
    },

    stock:{
        type:Number,
        required:[true, 'please enter product count'],
        maxLength:[4, 'IT can not go out fo four fegures'],
        default:1
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
             type:Number,
             required:true
            },
            comments:{
               type:String,
               required:true
            }
        }
    ],

    createdAt:{
        type:Date,
        default:Date.now
    }

    
    

})

const dataModel= mongoose.model("product",productSchema);

module.exports= dataModel
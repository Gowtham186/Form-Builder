import { Schema, model } from "mongoose";

const formSchema = new Schema({
    name : { type : String},
    fields : [
        {
            title : { 
                type : String, 
                required : true
            },
            type : { 
                type : String, 
                enum : ['text', 'email', 'password', 'number', 'date'],
                required : true
            },
            placeholder : { 
                type : String
            }
        }
    ]
}, { timestamps : true})

const Form = model('Form', formSchema)
export default Form
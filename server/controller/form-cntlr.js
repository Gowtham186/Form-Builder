import Form from "../models/form-model.js"

const formCntlr = {}

formCntlr.create = async(req,res)=>{
    const body = req.body
    console.log(body)
    
    try{
        const form = await Form.create(body)
        console.log(form)
        res.json(form)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

formCntlr.getAllForms = async(req,res)=>{
    try{
        const forms = await Form.find()
        if(forms.length ===0){
            return res.status(404).json({errors : 'no forms found'})
        }
        console.log(forms)
        res.json(forms)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

formCntlr.update = async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const body = req.body
    try{
        const form = await Form.findByIdAndUpdate(id, body, { new : true})
        if(!form){
            return res.status(404).json({errors : 'form not found'})
        }
        console.log(form)
        res.json(form)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

formCntlr.singleForm = async(req,res)=>{
    const id = req.params.id
    try{
        const form = await Form.findById(id)
        if(!form){
            return res.status(404).json({errors : 'form not found'})
        }
        console.log(form)
        res.json(form)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

formCntlr.delete = async(req,res)=>{
    const id = req.params.id
    try{

    }catch(err){
        console.log(err)
    }
}

export default formCntlr
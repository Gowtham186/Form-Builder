import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import configureDb from './config/db.js'
import formCntlr from './controller/form-cntlr.js'

const app = express()
dotenv.config()
configureDb()

app.use(express.json())
app.use(cors())

app.post('/api/forms', formCntlr.create)
app.get('/api/forms/:id', formCntlr.singleForm)
app.get('/api/forms', formCntlr.getAllForms)
app.put('/api/forms/:id', formCntlr.update)

app.listen(process.env.PORT, ()=>{
    console.log('server is running')
})
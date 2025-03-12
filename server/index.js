import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import configureDb from './config/db.js'

const app = express()
dotenv.config()
configureDb()

app.listen(process.env.PORT, ()=>{
    console.log('server is running')
})
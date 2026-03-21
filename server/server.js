import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DBconnect from './database/db.js'

dotenv.config()
DBconnect()
const app = express()
const PORT = process.env.PORT
app.use(cors())
app.use(express.json())
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})
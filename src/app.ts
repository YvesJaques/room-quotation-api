import 'reflect-metadata'
import express from 'express'
import router from '@/4-framework/routes/router'

const app = express()
app.use(express.json())

app.use('/', router)

export { app }

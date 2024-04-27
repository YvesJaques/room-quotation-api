import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import router from '@/4-framework/routes/router'

const app = express()
app.use(express.json())

const port = process.env.PORT || 8080

app.use('/', router)
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

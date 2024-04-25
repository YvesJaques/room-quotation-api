import httpPostRoomPriceSearch from '@/3-operations/roomPriceSearch.controller'
import express from 'express'

const router = express.Router()

router.post('/search', httpPostRoomPriceSearch)

export default router

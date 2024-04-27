import { IBrowserServiceToken } from '@/2-business/services/IBrowserService'
import { RoomPriceSearchController } from '@/3-operations/roomPriceSearch.controller'
import express from 'express'
import Container from 'typedi'
import { BrowserService } from '../services/BrowserService'

const router = express.Router()

Container.set(IBrowserServiceToken, new BrowserService())

const roomPriceSearchController = new RoomPriceSearchController()

router.post('/search', roomPriceSearchController.post)

export default router

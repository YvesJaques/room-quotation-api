import RoomPriceSearchUseCase from '@/2-business/roomPriceSearch.usecase'
import { Request, Response } from 'express'

async function httpPostRoomPriceSearch(req: Request, res: Response) {
  const roomPriceSearchUseCase = new RoomPriceSearchUseCase()

  const { checkin, checkout } = req.body

  const result = await roomPriceSearchUseCase.run({ checkin, checkout })

  return res.send(result)
}

export default httpPostRoomPriceSearch

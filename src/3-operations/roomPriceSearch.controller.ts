import { RoomPriceSearchUseCase } from '@/2-business/useCases/roomPriceSearch.usecase'
import { Request, Response } from 'express'
import Container from 'typedi'

export class RoomPriceSearchController {
  async post(req: Request, res: Response) {
    const roomPriceSearchUseCase = Container.get(RoomPriceSearchUseCase)

    const { checkin, checkout } = req.body

    const result = await roomPriceSearchUseCase.run({ checkin, checkout })

    return res.send(result)
  }
}

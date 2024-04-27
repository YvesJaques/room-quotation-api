import { RoomPriceSearchUseCaseOutput } from '../dto/roomPriceSearch/output'
import { Token } from 'typedi'

export interface IBrowserService {
  getRoomQuotations(
    checkin: Date,
    checkout: Date,
  ): Promise<RoomPriceSearchUseCaseOutput[]>
}

export const IBrowserServiceToken = new Token<IBrowserService>(
  'IBrowserServiceToken',
)

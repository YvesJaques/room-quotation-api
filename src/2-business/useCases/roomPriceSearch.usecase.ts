import { Inject, Service } from 'typedi'
import { RoomPriceSearchUseCaseInput } from '@/2-business/dto/roomPriceSearch/input'
import {
  IBrowserServiceToken,
  IBrowserService,
} from '../services/IBrowserService'

@Service()
export class RoomPriceSearchUseCase {
  @Inject(IBrowserServiceToken)
  private readonly browserService!: IBrowserService

  async run(input: RoomPriceSearchUseCaseInput) {
    return this.browserService.getRoomQuotations(
      new Date(input.checkin),
      new Date(input.checkout),
    )
  }
}

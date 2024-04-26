import { BrowserService } from '@/4-framework/services/BrowserService'
import { RoomPriceSearchUseCaseInput } from './dto/roomPriceSearch/input'

class RoomPriceSearchUseCase {
  async run(input: RoomPriceSearchUseCaseInput) {
    const browserService = new BrowserService()

    return browserService.getRoomQuotations(
      new Date(input.checkin),
      new Date(input.checkout),
    )
  }
}

export default RoomPriceSearchUseCase

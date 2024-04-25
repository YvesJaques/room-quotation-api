import { BrowserService } from '@/4-framework/services/BrowserService'

class RoomPriceSearchUseCase {
  async run(input: { checkin: string; checkout: string }) {
    const browserService = new BrowserService()

    return browserService.getRoomQuotations(
      new Date(input.checkin),
      new Date(input.checkout),
    )
  }
}

export default RoomPriceSearchUseCase

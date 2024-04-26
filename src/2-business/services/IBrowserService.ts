import { Browser } from 'puppeteer'
import { RoomPriceSearchUseCaseOutput } from '../dto/roomPriceSearch/output'

export interface IBrowserService {
  getBrowser(): Promise<Browser>
  closeBrowser(browser: Browser): Promise<void>
  getRoomQuotations(
    checkin: Date,
    checkout: Date,
  ): Promise<RoomPriceSearchUseCaseOutput[]>
}

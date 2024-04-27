import {
  roomBookingSiteBaseUrl,
  roomBookingUrlParams,
} from '@/2-business/consts/roomBookingPartner'
import { RoomPriceSearchUseCaseOutput } from '@/2-business/dto/roomPriceSearch/output'
import {
  IBrowserService,
  IBrowserServiceToken,
} from '@/2-business/services/IBrowserService'
import puppeteer, { Browser } from 'puppeteer'
import { Service } from 'typedi'

@Service({ transient: false, id: IBrowserServiceToken })
export class BrowserService implements IBrowserService {
  private getBrowser(): Promise<Browser> {
    return puppeteer.launch({})
  }

  closeBrowser(browser: Browser): Promise<void> {
    if (!browser) {
      return Promise.resolve()
    }
    return browser.close()
  }

  async getRoomQuotations(
    checkin: Date,
    checkout: Date,
  ): Promise<RoomPriceSearchUseCaseOutput[]> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.BROWSER_PATH || undefined,
      args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    })

    const formattedStartDate = checkin.toISOString().split('T')[0]
    const formattedEndDate = checkout.toISOString().split('T')[0]

    const page = await browser.newPage()

    const url = `${roomBookingSiteBaseUrl}${formattedStartDate}&checkout=${formattedEndDate}${roomBookingUrlParams}`
    await page.goto(url, {
      waitUntil: 'networkidle2',
    })

    await page.waitForSelector('[class="room-option-wrapper"]', {
      visible: true,
    })

    const roomsHandles = await page.$$('.room-option-wrapper')

    const items = []

    for (const roomHandle of roomsHandles) {
      try {
        const name = await page.evaluate(
          (el) =>
            el.querySelector('div.room-option-title.desktop-only > h3 > span')
              ?.textContent || '',
          roomHandle,
        )
        const description = await page.evaluate(
          (el) =>
            el.querySelector(
              'div.room-option > div.room-infos > div.room-infos-guests-block > div.room-option-title.desktop-only > p',
            )?.textContent || '',
          roomHandle,
        )

        const price1 = await page.evaluate(
          (el) =>
            el.querySelector('.daily-price--total > strong > span > strong')
              ?.textContent || '0',
          roomHandle,
        )

        const price2 = await page.evaluate(
          (el) =>
            el.querySelector(
              '.daily-price--total > strong > span > small:nth-child(3)',
            )?.textContent || ',00',
          roomHandle,
        )

        const price = 'R$ ' + price1 + price2

        const backgroundImageUrl = await page.evaluate(
          (el) =>
            el
              .querySelector(
                'div.room-option > div.carousel-wrapper > div.lb-carousel.room-option--carousel > span > div > div.q-carousel__slides-container > div > div',
              )
              ?.getAttribute('style') || '',
          roomHandle,
        )
        const image = backgroundImageUrl.match(/url\("(.*)"/)[1]

        items.push({ name, description, price, image })
      } catch {
        throw new Error(
          'Failed to fetch room price quotations, please try again later',
        )
      }
    }

    await this.closeBrowser(browser)
    return items
  }
}

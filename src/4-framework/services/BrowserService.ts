import 'dotenv/config'
import {
  roomBookingSiteBaseUrl,
  roomBookingUrlParams,
} from '@/2-business/consts/roomBookingPartner'
import { RoomPriceSearchUseCaseOutput } from '@/2-business/dto/roomPriceSearch/output'
import {
  IBrowserService,
  IBrowserServiceToken,
} from '@/2-business/services/IBrowserService'
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer'
import { Service } from 'typedi'

@Service({ transient: false, id: IBrowserServiceToken })
export class BrowserService implements IBrowserService {
  async getRoomQuotations(
    checkin: Date,
    checkout: Date,
  ): Promise<RoomPriceSearchUseCaseOutput[]> {
    const browser = await this.getBrowser()

    const formattedStartDate = checkin.toISOString().split('T')[0]
    const formattedEndDate = checkout.toISOString().split('T')[0]

    const page = await browser.newPage()

    const url = `${roomBookingSiteBaseUrl}${formattedStartDate}&checkout=${formattedEndDate}${roomBookingUrlParams}`
    await page.goto(url, {
      waitUntil: 'networkidle2',
    })

    if (process.env.ENV !== 'TEST') {
      await page.waitForSelector('[class="room-option"]', {
        visible: true,
      })
    }

    const roomHandles = await page.$$('.room-option-wrapper')

    const items = []

    for (const roomHandle of roomHandles) {
      try {
        const name = await this.getRoomName(page, roomHandle)

        const description = await this.getRoomDescription(page, roomHandle)

        const price = await this.getRoomPrice(page, roomHandle)

        const image = await this.getRoomImage(page, roomHandle)

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

  private getBrowser() {
    return puppeteer.launch({
      headless: true,
      executablePath: process.env.BROWSER_PATH || undefined,
      args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    })
  }

  closeBrowser(browser: Browser): Promise<void> {
    if (!browser) {
      return Promise.resolve()
    }
    return browser.close()
  }

  private async getRoomImage(page: Page, roomHandle: ElementHandle<Element>) {
    const backgroundImageUrl = await page.evaluate(
      (el) =>
        el
          .querySelector(
            'div.room-option > div.carousel-wrapper > div.lb-carousel.room-option--carousel > span > div > div.q-carousel__slides-container > div > div',
          )
          ?.getAttribute('style') || '',
      roomHandle,
    )

    const matchedBackgroundImageUrl =
      backgroundImageUrl.match(/url\("(.*)"/) || ''

    const image =
      matchedBackgroundImageUrl.length > 0 ? matchedBackgroundImageUrl[1] : ''
    return image
  }

  private async getRoomPrice(page: Page, roomHandle: ElementHandle<Element>) {
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
    return price
  }

  private getRoomDescription(page: Page, roomHandle: ElementHandle<Element>) {
    return page.evaluate(
      (el) =>
        el.querySelector(
          'div.room-option > div.room-infos > div.room-infos-guests-block > div.room-option-title.desktop-only > p',
        )?.textContent || '',
      roomHandle,
    )
  }

  private getRoomName(page: Page, roomHandle: ElementHandle<Element>) {
    return page.evaluate(
      (el) =>
        el.querySelector('div.room-option-title.desktop-only > h3 > span')
          ?.textContent || '',
      roomHandle,
    )
  }
}

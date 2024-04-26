import {
  roomBookingSiteBaseUrl,
  roomBookingUrlParams,
} from '@/2-business/consts/roomBookingPartner'
import puppeteer, { Browser } from 'puppeteer'

export class BrowserService {
  getBrowser() {
    return puppeteer.launch({})
  }

  closeBrowser(browser: Browser) {
    if (!browser) {
      return
    }
    return browser.close()
  }

  async getRoomQuotations(checkin: Date, checkout: Date) {
    const browser = await puppeteer.launch({
      headless: true,
    })

    const formattedStartDate = checkin.toISOString().split('T')[0]
    const formattedEndDate = checkout.toISOString().split('T')[0]

    const page = await browser.newPage()
    // const url = 'https://pratagy.letsbook.com.br/reserva/selecao-de-quartos?checkin=2024-06-21&checkout=2024-06-25&criancas&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&numeroAdultos=2&codigoHotel=12&codigoCidade&device=Desktop&idioma=pt-BR&moeda=BRL&emailHospede'
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

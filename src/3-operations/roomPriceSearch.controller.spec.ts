import { app } from '@/app'
import request from 'supertest'

jest.setTimeout(30000)
describe('RoomPriceSearch.Controller', () => {
  beforeAll(async () => {})

  afterAll(async () => {})

  it('Should be able to fetch room quotations', async () => {
    const checkin = new Date()
    const checkout = new Date()
    checkout.setDate(checkout.getDate() + 30)

    const response = await request(app)
      .post('/search')
      .send({
        checkin: checkin.toISOString().split('T')[0],

        checkout: checkout.toISOString().split('T')[0],
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(String),
          description: expect.any(String),
          image: expect.any(String),
        }),
      ]),
    )
  })

  it('Should return empty results for invalid dates', async () => {
    const checkin = '2021-10-22'
    const checkout = '2021-11-22'

    const response = await request(app).post('/search').send({
      checkin,
      checkout,
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual([])
  })
})

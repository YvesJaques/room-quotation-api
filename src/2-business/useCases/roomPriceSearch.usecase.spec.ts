import 'reflect-metadata'
import { Container } from 'typedi'
import { IBrowserServiceToken } from '../services/IBrowserService'
import { RoomPriceSearchUseCase } from './roomPriceSearch.usecase'
import { RoomPriceSearchUseCaseInput } from '../dto/roomPriceSearch/input'
import { RoomPriceSearchUseCaseOutput } from '../dto/roomPriceSearch/output'

const mockInput = {
  checkin: '2024-01-26',
  checkout: '2024-01-26',
}

const mockSuccessOutput: RoomPriceSearchUseCaseOutput = {
  name: 'Suíte Família Superior',
  description:
    '220 AC, Amenidades de Banho, Ar Condicionado, Ar Condicionado, Berço disponivel a pedido, Canais a cabo, Cofre, Cofre, Frigobar, Guarda-roupa, Internet Wi-fi Grátis , Internet Wireless, Secador de Cabelo, Secador de cabelo, Serviço de limpeza diário, Televisão, Toalha de Banho, TV, TV por Cabo, Varanda',
  price: 'R$ 1.569,50',
  image:
    'https://letsimage.s3.amazonaws.com/letsbook/193/quartos/61/fotoprincipal.jpg',
}

describe('RoomPriceSearchUseCase', () => {
  beforeEach(() => {
    Container.reset()

    Container.set(IBrowserServiceToken, {
      getRoomQuotations: jest.fn().mockResolvedValue([mockSuccessOutput]),
    })
  })

  it('Should be able to fetch room prices and info', async () => {
    const useCase = Container.get(RoomPriceSearchUseCase)
    const browserService = Container.get(IBrowserServiceToken)
    const getRoomQuotations = jest.spyOn(browserService, 'getRoomQuotations')
    const input: RoomPriceSearchUseCaseInput = mockInput

    const output = await useCase.run(input)

    const expectedOutput = [mockSuccessOutput]

    expect(output).toStrictEqual(expectedOutput)
    expect(getRoomQuotations).toHaveBeenCalledWith(
      expect.any(Date),
      expect.any(Date),
    )
  })

  it('Should throw "Failed to fetch room price quotations, please try again later" when it fails to fetch room quotations', async () => {
    const useCase = Container.get(RoomPriceSearchUseCase)
    const browserService = Container.get(IBrowserServiceToken)
    jest
      .spyOn(browserService, 'getRoomQuotations')
      .mockRejectedValue(
        new Error(
          'Failed to fetch room price quotations, please try again later',
        ),
      )
    const input: RoomPriceSearchUseCaseInput = mockInput

    await expect(useCase.run(input)).rejects.toEqual(
      Error('Failed to fetch room price quotations, please try again later'),
    )
  })
})

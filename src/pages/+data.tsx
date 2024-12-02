// import type { PageContextServer } from 'vike/types'

// eslint-disable-next-line react-refresh/only-export-components
export { data, type Response }

type Response = {
  year: APIResponse
  daily: APIResponse
}

type APIResponse = {
  time: number
  high: number
  low: number
  open: number
  volumefrom: number
  volumeto: number
  close: number
  conversionType: string
  conversionSymbol: string
}[]

async function data(): Promise<Response> {
  const priceData: Response = {
    year: [],
    daily: [],
  }
  {
    const response = await fetch(
      'https://min-api.cryptocompare.com/data/v2/histoday?fsym=XRP&tsym=USD&limit=365',
      {
        headers: {
          authorization: `Apikey ${import.meta.env.API_KEY}`,
        },
      }
    )
    const json = await response.json()
    priceData.year = json.Data.Data
  }
  
  {
    const response = await fetch(
      'https://min-api.cryptocompare.com/data/v2/histominute?fsym=XRP&tsym=USD&limit=96&aggregate=15',
      {
        headers: {
          authorization: `Apikey ${import.meta.env.API_KEY}`,
        },
      }
    )
    const json = await response.json()
    priceData.daily = json.Data.Data
  }
  return priceData
}

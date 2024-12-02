import { Client } from 'xrpl'

export async function getCurrentPrice() {
  const client = new Client('wss://xrpl.ws')
  await client.connect()
  const response = await client.request({
    command: 'get_aggregate_price',
    base_asset: 'XRP',
    quote_asset: 'USD',
    trim: 20,
    oracles: Array(10).fill(0).map((_, i) => ({
      account: 'roosteri9aGNFRXZrJNYQKVBfxHiE5abg',
      oracle_document_id: i,
    })),
  })
  client.disconnect()
  return Number(response.result.median)
}

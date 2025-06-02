import { useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, Legend, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useSWR from 'swr/immutable'
import { apiBaseUrl, dateFormatter, nativeToken, timeFormatter, valueToString } from '../utils';
import { Stats } from './Stats';
import { Network } from '../types';

type APIResponse = {
  "timestamp": string //"2024-06-25T00:00:00.000Z",
  "volume": number
  "exchanges": number
  "distinct_pairs": number
}[]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const VolumeChart = ({ base, network, yearPrices, dailyPrices }: { base: string, network: Network, yearPrices: Record<string, number>, dailyPrices: Record<string, number> }) => {
  const { data: chartDataAMM } = useSWR<APIResponse>(`${apiBaseUrl(network)}/v1/iou/volume_data/${nativeToken(network)}?interval=1d&exclude_amm=true&only_amm=false&descending=true&limit=90`, fetcher,)
  const { data: chartDataOB } = useSWR<APIResponse>(`${apiBaseUrl(network)}/v1/iou/volume_data/${nativeToken(network)}?interval=1d&exclude_amm=false&only_amm=true&descending=true&limit=90`, fetcher)
  const { data: volumeData } = useSWR<APIResponse>(`${apiBaseUrl(network)}/v1/iou/volume_data/${nativeToken(network)}?interval=15m&exclude_amm=false&only_amm=false&descending=true&skip=0&limit=96`, fetcher)

  const data = useMemo(() => {
    if (!chartDataAMM || !chartDataOB) return []
    if (chartDataAMM.length !== chartDataOB.length) return []
    const chartData = chartDataAMM.map((item, i) => {
      if (item.timestamp !== chartDataOB[i].timestamp) throw Error('Timestamp mismatch')
      const obVolume = chartDataOB[i].volume
      return {
        timestamp: item.timestamp,
        amm: network === 'xrpl' ? item.volume : 0,
        orderbook: obVolume,
        volume: item.volume + obVolume
      }
    })
    return [...chartData]
      .reverse()
      .map(({ timestamp, volume,amm,orderbook }) => ({
        date: dateFormatter(timestamp),
        amt: Math.round(volume * (yearPrices[dateFormatter(timestamp)] ?? 1)),
        amm: Math.round(amm * (yearPrices[dateFormatter(timestamp)] ?? 1)),
        orderbook: Math.round(orderbook * (yearPrices[dateFormatter(timestamp)] ?? 1))
      }))
  }, [chartDataAMM, chartDataOB, network, yearPrices])
  
  const volume24h = useMemo(() => {
    if (!volumeData) return 0
    return Math.round(volumeData.reduce((acc, { volume,timestamp }) => acc + volume * (dailyPrices[timeFormatter(timestamp)] ?? 1), 0))
  },[dailyPrices, volumeData])

  return (
    <div className='mt-4'>
      <Stats shadow title={`Total Volume (24h, OrderBook${network === 'xrpl' ? '+AMM' : ''})`} value={`${volume24h.toLocaleString()} ${base}`} desc={`Only ${nativeToken(network)} pair`} />
      <hr className='my-4' />
      <Stats title="" value={`Total Volume (${base})`} desc={`Only ${nativeToken(network)} pair`} />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: -30, left: 35 }}>
          {network === 'xrpl' &&
            <Bar type="monotone" dataKey="amm" name="AMM" stackId="a" fill="#8884d8" />
          }
          <Bar type="monotone" dataKey="orderbook" name="OrderBook" stackId="a" fill="#82ca9d" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis dataKey="amt" tickFormatter={(v) => valueToString(v)} />
          <Tooltip formatter={(value, name) => [`${name}: ${value.toLocaleString()}${base}`]} />
        <Legend verticalAlign="bottom" height={36}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
};

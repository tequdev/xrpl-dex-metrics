import { useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from 'recharts';
import useSWR from 'swr/immutable'
import { dateFormatter } from '../utils';
import { Stats } from './Stats';

type APIResponse = {
  "timestamp": string //"2024-06-25T00:00:00.000Z",
  "volume": number
  "exchanges": number
  "distinct_pairs": number
}[]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const VolumeChart = () => {
  const { data: chartDataAMM } = useSWR<APIResponse>("https://data.xrplf.org/v1/iou/volume_data/XRP?interval=1d&exclude_amm=true&only_amm=false&descending=true&limit=90", fetcher)
  const { data: chartDataOB } = useSWR<APIResponse>("https://data.xrplf.org/v1/iou/volume_data/XRP?interval=1d&exclude_amm=false&only_amm=true&descending=true&limit=90", fetcher)
  const { data: volumeData } = useSWR<APIResponse>("https://data.xrplf.org/v1/iou/volume_data/XRP?interval=15m&exclude_amm=false&only_amm=false&descending=true&skip=0&limit=96", fetcher)

  const data = useMemo(() => {
    if (!chartDataAMM || !chartDataOB) return []
    if (chartDataAMM.length !== chartDataOB.length) return []
    const chartData = chartDataAMM.map((item, i) => {
      if (item.timestamp !== chartDataOB[i].timestamp) throw Error('Timestamp mismatch')
      const obVolume = chartDataOB[i].volume
      return {
        timestamp: item.timestamp,
        amm: item.volume,
        orderbook: obVolume,
        volume: item.volume + obVolume
      }
    })
    return [...chartData]
      .reverse()
      .map(({ timestamp, volume,amm,orderbook }) => ({
        date: dateFormatter(timestamp),
        amt: parseInt(volume.toString()),
        amm: parseInt(amm.toString()),
        orderbook: parseInt(orderbook.toString())
      }))
  }, [chartDataAMM, chartDataOB])
  
  const volume24h = useMemo(() => {
    if (!volumeData) return 0
    return parseInt(volumeData.reduce((acc, { volume }) => acc + volume, 0).toString())
  },[volumeData])

  return (
    <div>
      <Stats shadow title="Total Volume (24h, OrderBook+AMM)" value={`${volume24h.toLocaleString()} XRP`} desc="Only XRP pair" />
      <hr className='my-8' />
      <Stats title="" value='Total Volume' desc="Only XRP pair" />
      <BarChart width={640} height={300} data={data} margin={{ top: 5, right: 20, bottom: -30, left: 35 }}>
        <Bar type="monotone" dataKey="amm" name="AMM" stackId="a" fill="#8884d8" />
        <Bar type="monotone" dataKey="orderbook" name="OrderBook" stackId="a" fill="#82ca9d" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis dataKey="amt" tickFormatter={(v) => v.toLocaleString()} />
        <Tooltip formatter={(value, name) => [`${name}: ${value.toLocaleString()}XRP`]} />
      <Legend verticalAlign="bottom" height={36}/>
      </BarChart>
    </div>
  )
};

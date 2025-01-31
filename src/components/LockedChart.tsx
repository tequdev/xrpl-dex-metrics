import { useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import useSWR from 'swr/immutable'
import { dateFormatter, nativeToken, valueToString } from '../utils';
import { Stats } from './Stats';
import { Network } from '../types';

type APIResponse = {
  "date": string // "2024-03-22T00:00:00.000Z"
  "amm": {
    "xrp_locked": number,
    "amm_count": number
  }
}[]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const LockedChart = ({ base, network, yearPrices }: { base: string, network: Network, yearPrices: Record<string, number> }) => {
  const { data: _data } = useSWR<APIResponse>("https://api.xrpscan.com/api/v1/metrics/amm", fetcher)

  const data = useMemo(() => {
    if (network === 'xahau') return []
    if (!_data) return []
    return [..._data]
      .reverse()
      .filter((_, i) => i < 90)
      .reverse()
      .map(({ date, amm }) => ({
        date: dateFormatter(date),
        amt: Math.round((amm.xrp_locked * 2) * (yearPrices[dateFormatter(date)] ?? 1)),
        amtXrp: Math.round(amm.xrp_locked * (1))
      }))
  }, [_data, network, yearPrices])

  const lockedAmtStr = data.length > 0 ? Math.round(data[data.length - 1].amt).toLocaleString() : '0'
  const lockedXRPStr = data.length > 0 ? Math.round(data[data.length - 1].amtXrp).toLocaleString() : '0'

  return (
    <div>
      <Stats shadow title="Total Value Locked" value={`${lockedAmtStr} ${base} equ.`} desc={`${lockedXRPStr} ${nativeToken(network)} + ${lockedXRPStr} ${nativeToken(network)} equ. tokens`} />
      <hr className='my-8' />
      <Stats title="" value={`Total Value Locked (${base})`} desc={`for ${nativeToken(network)} pair`} />
      <BarChart width={640} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 35 }}>
        <Bar type="monotone" dataKey="amt" fill="#82ca9d" color="#82ca9d" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis dataKey="amt" tickFormatter={(v) => valueToString(v)} />
        <Tooltip formatter={(value) => [`${value.toLocaleString()}${base}`]} />
      </BarChart>
    </div>
  )
};

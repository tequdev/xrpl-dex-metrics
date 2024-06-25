import { useMemo } from 'react';
import { Treemap } from 'recharts';
import useSWR from 'swr/immutable'
import { Stats } from './Stats';
import { parseCurrency } from '../utils';

type APIResponse = {
  Account: string
  Asset: {
    currency: string
  }
  Asset2: {
    currency: string
    issuer: string
  }
  Balance: number // drop
}[]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const LockedMap = () => {
  const { data: _data } = useSWR<APIResponse>("https://api.xrpscan.com/api/v1/amm/pools", fetcher)

  const data = useMemo(() => {
    if (!_data) return []

    return [..._data]
      .filter((a) => a.Asset.currency === 'XRP')
      .map(({ Asset2, Balance }) => ({
        name: parseCurrency(Asset2.currency),
        size: parseInt(String(Balance/1_000_000))
      }))
  }, [_data])

  return (
    <div>
      <Stats value='Locked Map' title='' desc='for XRP pair pool' />
      <Treemap
        width={1280}
        height={500}
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        fill="#82ca9d"
      />
    </div>
  )
};

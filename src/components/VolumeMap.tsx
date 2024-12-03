import { useMemo } from 'react';
import { Treemap } from 'recharts';
import useSWR from 'swr/immutable'
import { Stats } from './Stats';
import { apiBaseUrl, nativeToken, parseCurrency } from '../utils';
import { Network } from '../types';

type APIResponse = {
  "date_from": string
  "date_to": string
  "base": string,
  "counter": string,
  "first": number,
  "last": number
  "low": number,
  "high": number,
  "base_volume": number,
  "counter_volume": number,
  "trend_interval": number,
  "exchanges": number
}[]

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const VolumeMap = ({ network }: { network: Network }) => {
  const { data: _data } = useSWR<APIResponse>(`${apiBaseUrl(network)}/v1/iou/ticker_data/${nativeToken(network)}?interval=1d&exclude_amm=false&only_amm=false&min_exchanges=1`, fetcher)

  const data = useMemo(() => {
    if (!_data) return []
    return [..._data]
      .sort((a, b) => b.base_volume - a.base_volume)
      .map(({ counter, base_volume }) => ({
        name: parseCurrency(counter.split('_')[1]),
        size: parseInt(base_volume.toString())
      }))
  }, [_data])

  return (
    <div>
      <Stats value='Volume Map' title='' desc={`for ${nativeToken(network)} pair`} />
      <Treemap
        width={1280}
        height={500}
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        isAnimationActive={false}
        fill="#82ca9d"
      />
    </div>
  )
};

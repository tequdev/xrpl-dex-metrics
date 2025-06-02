import './index.css'
import './App.css'
import { VolumeChart } from '../components/VolumeChart'
import { LockedChart } from '../components/LockedChart'
import { VolumeMap } from '../components/VolumeMap'
import { LockedMap } from '../components/LockedMap'
import { useEffect, useMemo, useState } from 'react'
import { Network } from '../types'
import { useData } from 'vike-react/useData'
import { Response } from './+data'
import { dateFormatter, timeFormatter } from '../utils'
import { getCurrentPrice } from '../lib/currentPrice'

function App() {
  const data = useData<Response>()
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [network, setNetwork] = useState<Network>('xrpl')
  const [base, setBase] = useState<'XRP' | 'XAH' | 'USD'>('XRP')
  
  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNetwork(e.target.checked ? 'xahau' : 'xrpl')
    setBase(e.target.checked ? 'XAH' : 'XRP')
  }

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBase(e.target.checked ? 'USD' : (network === 'xrpl' ? 'XRP' : 'XAH'))
  }
  
  const yearPrices = useMemo(() => {
    if (base !== 'USD') return {}
    if (currentPrice !== null) data.year[data.year.length-1] = { ...data.year[data.year.length-1], close: currentPrice }
    const prices = data.year.reduce((prev, item) => ({ ...prev, [dateFormatter(item.time * 1000)]: item.close }), {} as Record<string, number>)
    return prices
  }, [data, base, currentPrice])
  
  const dailyPrices = useMemo(() => {
    if (base !== 'USD') return {}
    if (currentPrice !== null) data.daily[data.daily.length-1] = { ...data.daily[data.daily.length-1], close: currentPrice }
    const prices = data.daily.reduce((prev, item) => ({ ...prev, [timeFormatter(item.time * 1000)]: item.close }), {} as Record<string, number>)
    return prices
  }, [data, base, currentPrice])
  
  useEffect(() => {
    getCurrentPrice().then((price) => {
      setCurrentPrice(price)
    })
  }, [])
  
  return (
    <>
      <h1 className='mb-12'>{network === 'xrpl' ? 'XRPL' : 'Xahau'} DEX Metrics</h1>
      <div className='flex justify-center mb-2'>
        <div className="form-control w-48">
          <label className="label cursor-pointer">
            <span className="label-text">XRPL</span>
            <input type="checkbox" className="toggle" checked={network === 'xahau'} onChange={handleNetworkChange} />
            <span className="label-text">Xahau</span>
          </label>
        </div>
      </div>
      <div className='flex justify-center mb-2'>
        <div className="form-control w-48">
          <label className="label cursor-pointer">
            <span className="label-text">{network === 'xrpl' ? 'XRP' : 'XAH'}</span>
            <input type="checkbox" className="toggle" checked={base === 'USD'} disabled={network === 'xahau'} onChange={handleBaseChange} />
            <span className="label-text">USD</span>
          </label>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <VolumeChart base={base} network={network} yearPrices={yearPrices} dailyPrices={dailyPrices} />
        <LockedChart base={base} network={network} yearPrices={yearPrices} />
      </div>
      <VolumeMap base={base} network={network} />
      {network === 'xrpl' && <LockedMap base={base} />}
    </>
  )
}

export default App

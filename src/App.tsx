
import './App.css'
import { VolumeChart } from './components/VolumeChart'
import { LockedChart } from './components/LockedChart'
import { VolumeMap } from './components/VolumeMap'
import { LockedMap } from './components/LockedMap'
import { useState } from 'react'
import { Network } from './types'

function App() {
  const [network, setNetwork] = useState<Network>('xrpl')
  
  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNetwork(e.target.checked ? 'xahau' : 'xrpl')
  }

  return (
    <>
      <h1 className='mb-12'>{network === 'xrpl' ? 'XRPL' : 'Xahau'} DEX Metrics</h1>
      <div className='flex justify-center mb-4'>
        <div className="form-control w-48">
          <label className="label cursor-pointer">
            <span className="label-text">XRPL</span>
            <input type="checkbox" className="toggle" checked={network === 'xahau'} onChange={handleNetworkChange} />
            <span className="label-text">Xahau</span>
          </label>
        </div>
      </div>
      <div className="flex">
        <VolumeChart network={network} />
        <LockedChart network={network} />
      </div>
      <VolumeMap network={network} />
      {network === 'xrpl' && <LockedMap />}
    </>
  )
}

export default App


import './App.css'
import { VolumeChart } from './components/VolumeChart'
import { LockedChart } from './components/LockedChart'
import { VolumeMap } from './components/VolumeMap'
import { LockedMap } from './components/LockedMap'

function App() {
  return (
    <>
      <h1 className='mb-16'>XRPL DEX Metrics</h1>
      <div className="flex">
        <VolumeChart />
        <LockedChart />
      </div>
      <VolumeMap />
      <LockedMap />
    </>
  )
}

export default App

import { useState } from "react"
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [apiEndPoint, setApiEndpoint] = useState("/api/unicorns")
  const [isRedirecting, setIsRedirecting] = useState(false)

  const goToApiEndpoint = () => {    
    setIsRedirecting(true)
    router.push(apiEndPoint)
  }

  return (
    <div className="bg-gradient-to- flex flex-col bg-sky-500 pt-24 pb-24 shadow-xl ring-1 ring-gray-900/5">
      <div className="mx-auto flex text-6xl font-black">
        <div className="text-yellow-400">THINKABLE</div>
        <div className="ml-4 text-gray-100">API</div>
      </div>
      <div className="mx-auto text-gray-200">Unthinkable APIs made tinkerable using chat GPT</div>
      <div className="mt-8 flex items-center justify-center space-x-2 self-center font-mono text-gray-700">
        <input
          value={apiEndPoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          placeholder="/api/magic-frogs/abilities"
          className="flex items-center justify-center self-center rounded bg-gray-300 py-1 px-2 font-mono text-gray-700" />

          {!isRedirecting && (
            <div
              onClick={goToApiEndpoint}
              className="cursor-pointer flex items-center justify-center self-center rounded bg-yellow-400 py-1 px-2 font-mono text-gray-700"
            >Go!</div>
          )}
          {isRedirecting && (
            <div className="flex items-center justify-center self-center rounded bg-yellow-400 py-1 px-2 font-mono text-gray-700 animate-pulse">Building your API...</div>
          )}
        </div>
      <div className="w-full px-12">      
          {isRedirecting && (
            <div className="flex items-center justify-center self-center text-xs mt-4 mb-2 font-mono text-gray-700">First time requests are painfully slow. Then we will cache it.</div>
          )}      
        <img alt="result" className="mt-12 shadow-2xl" src="https://i.imgur.com/GN0pSdU.png" />    
      </div>
    </div>
  )
}

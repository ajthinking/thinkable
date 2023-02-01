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
    <div className="bg-gradient-to- flex flex-col pt-4 sm:pt-12 pb-24 ring-1 ring-gray-900/5">
      <div className="justify-left px-2 sm:justify-center flex text-2xl sm:text-6xl font-black">
        <div className="text-yellow-400">THINKABLE</div>
        <div className="ml-2 sm:ml-4 text-gray-100">API</div>
      </div>
      <div className="justify-left px-2 sm:justify-center flex text-gray-200 px-2">Any API you can think of - powered by chat GPT</div>
      <div className="px-2 mt-8 w-full max-w-2xl flex items-center justify-center space-x-2 self-center font-mono text-gray-700">
        {!isRedirecting && (<input
          value={apiEndPoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          placeholder="/api/magic-frogs/abilities"
          className="flex w-full max-w-2xl items-center justify-center self-center rounded bg-gray-300 py-1 px-2 font-mono text-gray-700"
        />)}

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
      {!isRedirecting && (<div className="flex flex-col justify-center w-full px-2 sm:px-12">      
        <img alt="result" className="self-center mt-12 shadow-2xl sm:max-w-2xl" src="https://i.imgur.com/GN0pSdU.png" />    
      </div>)}
    </div>
  )
}

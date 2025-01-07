import dynamic from 'next/dynamic'

const BateauGame = dynamic(() => import('../components/BateauGame'), {
  ssr: false,
})

export default function Home() {
  return <BateauGame />
}
import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-yellow-400 border-b border-black py-10 lg:py-0">
        <div className="px-10 space-y-8">
          <h1 className="text-6xl max-w-xl font-notosans leading-tight">
            Medium is a place to <span className="text-green-700"> write</span>, <span className="text-green-700"> read </span> and <span className="text-green-700"> connect </span>
           </h1>
          <h2 className="text-2xl font-light max-w-xl font-notosans">
            It's easy and free to post your thinking on any topic and connect
            with millions of readers.
          </h2>
        </div>
        <div>
          <img
            className="hidden md:inline-flex h-64 lg:h-full"
            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default Home

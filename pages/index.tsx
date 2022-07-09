import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import Link from "next/link" 

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  const makeSortString = (des: string) => {
    if (des.length > 30) {
      des = des.substring(0, 60);
      return des;
    }
    return des;
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group border border-slate-100 bg-slate-50 cursor-pointer overflow-hidden">
              <img 
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()!} 
                alt="" 
              />
              <div className="flex justify-between p-4 space-x-2 ">
                <div className="space-y-1">
                  <p className="font-notosans text-lg">{post.title}</p>
                  <p className="font-notosans">
                    {makeSortString(post.description)} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 object-cover rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `
    *[_type == "post"]{
      _id,
      title,
      author -> {
        name, 
        image
      },
      description,
      mainImage,
      slug
    }
  `;
  
  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
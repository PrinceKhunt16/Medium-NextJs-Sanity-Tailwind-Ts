import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  return (
    <main className="max-w-7xl mx-auto">
      <Header />
      <div className="border-b border-black">
        <img
          className="w-full h-64 object-cover"
          src={urlFor(post.mainImage).url()!}
          alt="image"
        />
      </div>
      <article className="max-w-3xl mx-auto px-2">
        <div className="flex items-center space-x-3 mt-8 mb-3">
          <img
            className="h-14 w-14 object-cover rounded-full"
            src={urlFor(post.author.image).url()!}
            alt="user"
          />
          <p className="font-notosans font-normal text-base">
            Post by{" "}
            <span className="text-green-700"> {post.author.name} </span> - 
            published at {new Date(post.publishedAt).toLocaleString()}
          </p>
        </div>
        <h1 className="font-notosans text-4xl font-light mt-7">
          {post.title}
        </h1>
        <div className="portableDataSection">
          <PortableText
            className="mt-7 font-notosans font-normal space-y-2 text-justify"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1
                  className="font-notosans text-3xl font-light my-2"
                  {...props}
                />
              ),
              h2: (props: any) => (
                <h2
                  className="font-notosans text-xl font-light my-5"
                  {...props}
                />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              )
            }}
          />
        </div>
        <hr className="max-w-3xl my-5 mx-auto border-green-700"/>
      </article>
      <div className="max-w-3xl mx-auto px-2 my-5">
        <form className="flex flex-col my-10">
          <h3 className="font-notosans text-3xl font-light mb-5">Leave a Comment below!</h3>
          <label className="block my-4">
            <h3 className="font-notosans text-lg font-normal">Name</h3>
            <input className="text-gray-800 mt-2 border p-2 rounded font-notosans font-normal w-full focus:outline-none" type="text" placeholder="Name" name="" id="" />
          </label>
          <label className="block my-4">
            <h3 className="font-notosans text-lg font-normal">Email</h3>
            <input className="text-gray-800 mt-2 border p-2 rounded font-notosans font-normal w-full focus:outline-none" type="text" placeholder="Email" name="" id="" />
          </label>
          <label className="block my-4">
            <h3 className="font-notosans text-lg font-normal">Comment</h3>
            <textarea className="text-gray-800 mt-2 border p-2 rounded font-notosans font-normal w-full focus:outline-none" placeholder="Comment" rows={8} name="" id="" />
          </label>
        </form>
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
		_id,
		slug {
			current
		}
	}`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
		*[_type == "post" && slug.current == $slug][0]{
		  _id,
		  title,
		  author -> {
			name, 
			image
		  },
		  description,
          publishedAt,
		  mainImage,
		  slug,
          body
		}`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

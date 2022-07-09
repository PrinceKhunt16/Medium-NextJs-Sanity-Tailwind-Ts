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
            className="h-12 w-12 object-cover rounded-full"
            src={urlFor(post.author.image).url()!}
            alt="user"
          />
          <p className="font-notosans font-normal text-base">
            Blog post by{" "}
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
      </article>
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

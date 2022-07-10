import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface Props {
  post: Post;
}

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
        setSubmitted(false);
      });
  };

  return (
    <main className="max-w-7xl mx-auto">
      <Header />
      <div className="border-b border-black">
        <img
          className="w-full h-80 object-cover"
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
          <p className="font-notosans font-normal text-lg">
            Post by <span> {post.author.name} </span> - published at{" "}
            {new Date(post.publishedAt).toLocaleString()}
          </p>
        </div>
        <h1 className="font-notosans text-4xl font-light mt-7">{post.title}</h1>
        <div className="portableDataSection">
          <PortableText
            className="mt-7 font-notosans font-normal text-lg space-y-2 text-justify"
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
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
        <hr className="my-8"/>
      </article>
      <div className="max-w-3xl mx-auto px-2">
        {submitted ? (
          <h1 className="bg-white border mt-4 rounded font-notosans text-lg font-normal cursor-pointer p-2 w-full">
            Your comment has been submited and Thank you for commented !
          </h1>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <h3 className="font-notosans text-3xl font-light mb-5">
              Leave a Comment below!
            </h3>
            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <label className="block my-4">
              <h3 className="font-notosans text-lg font-normal">Name</h3>
              <input
                {...register("name", { required: true })}
                className="text-gray-800 mt-2 border p-2 rounded font-notosans font-normal w-full focus:outline-none"
                type="text"
                placeholder="Name"
                name="name"
                id="name"
              />
            </label>
            <label className="block my-4">
              <h3 className="font-notosans text-lg font-normal">Email</h3>
              <input
                {...register("email", { required: true })}
                className="text-gray-800 mt-2 border p-2 rounded font-notosans font-normal w-full focus:outline-none"
                type="text"
                placeholder="Email"
                name="email"
                id="email"
              />
            </label>
            <label className="block my-4">
              <h3 className="font-notosans text-lg font-normal">Comment</h3>
              <textarea
                {...register("comment", { required: true })}
                className="text-gray-800 mt-2 border p-2 rounded font-notosans font-normal w-full focus:outline-none"
                placeholder="Comment"
                rows={8}
                name="comment"
                id="comment"
              />
            </label>
            <div className="flex flex-cols space-x-3">
              {errors.name && (
                <span className="font-notosans font-normal">
                  Name is required
                </span>
              )}
              {errors.email && (
                <span className="font-notosans font-normal">
                  Email is required
                </span>
              )}
              {errors.comment && (
                <span className="font-notosans font-normal">
                  Comment is required
                </span>
              )}
            </div>
            <input
              type="submit"
              value="Submit"
              className="bg-white border mt-4 rounded font-notosans text-lg font-normal cursor-pointer focus:shadow-outline focus:outline-none p-2 w-full"
            />
          </form>
        )}
         <hr className="my-8"/>
        <div className="mb-4">
          <h1 className="font-notosans text-3xl font-light mb-5">
            Comments
          </h1>
          {
            post.comments.map((comment) => (
              <div className="bg-white border mt-4 rounded space-y-3 font-notosans p-2 w-full" key={comment._id}>
                <p className="text-lg">{comment.name}</p>
                <p className="text-base">{comment.comment}</p>
              </div>
            ))
          }
        </div>
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
      "comments": *[
        _type == "comment" 
        && post._ref == ^._id 
        && approved == true
      ],
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

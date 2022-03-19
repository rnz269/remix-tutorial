import {json, useLoaderData} from "remix"
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import {getPost} from "~/post"

export const loader: LoaderFunction = async ({ params }) => {
  // The part of the filename attached to the $ becomes a named key on the params obj
  invariant(params.slug, "expected params.slug")
  // gets the relevant post from the file system based on this page's slug
  return json(await getPost(params.slug))
}

export default function PostSlug() {
  const post = useLoaderData()
  return (
    <main dangerouslySetInnerHTML={{ __html: post.html }} />
  );
}
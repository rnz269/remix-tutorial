import {json, useLoaderData, useActionData, useTransition, redirect, Form} from "remix"
import type { LoaderFunction, ActionFunction } from "remix";
import invariant from "tiny-invariant";
import {getPost, createPost} from "~/post"

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  // The part of the filename attached to the $ becomes a named key on the params obj
  // Ensure .slug is defined, using invariant to narrow
  invariant(params.slug, "expected params.slug")
  // gets the relevant post from the file system based on this page's slug
  return json(await getPost(params.slug))
}

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {}
  if (!title) errors.title = true
  if (!slug) errors.slug = true
  if (!markdown) errors.markdown = true

  if (Object.keys(errors).length) {
    return json(errors);
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function PostSlug() {
  const errors = useActionData()
  const transition = useTransition()
  const post = useLoaderData()
  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {" "}
          {errors?.title ? (<em>Title is required</em>) : null} 
          <input type="text" name="title" defaultValue={post.title}/>
        </label>
      </p>
      <p>
        <label>
          Post Slug: {" "}
          {errors?.slug ? (<em>Slug is required</em>): null}
          <input type="text" name="slug" disabled value={post.slug}/>
        </label>
      </p>
      <p>
      <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown ? (
          <em>Markdown is required</em>
        ) : null}

        <br />
        {/* add key to reset input with latest default value upon changing posts */}
        <textarea id="markdown" key={post.slug} rows={20} name="markdown" defaultValue={post.html}/>
      </p>
      <p>
        <button type="submit">{transition.submission ? "Updating" : "Update Post"}</button>
      </p>
    </Form>
  );
}
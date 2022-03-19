import { json, Outlet, Link, useLoaderData } from "remix";

import { getPosts } from "~/post";
import type { Post } from "~/post";
import adminStyles from "~/styles/admin.css";

export const loader = async () => {
  return json(await getPosts());
};

// Each route can export a links fn that returns array of <link> tags in obj form
export const links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export default function Admin() {
  const posts = useLoaderData<Post[]>();
  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        {/* when the URL matches the parent route's path, the index route will render inside the outlet.*/}
        <Outlet />
      </main>
    </div>
  );
}
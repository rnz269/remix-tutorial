import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import invariant from "tiny-invariant"
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
}

export type PostMarkdownAttributes = {
  title: string;
};

const postsPath = path.join(__dirname, "..", "posts")

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

// returns an array of post objects from file system
export async function getPosts() {
  // returns an array of all the filenames in the directory
  const dir = await fs.readdir(postsPath)
  // for each filename, parse the file and return the slug & title
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(
        path.join(postsPath, filename)
      )
      const {attributes} = parseFrontMatter(
        file.toString()
      )
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      }
    })
  )
}

// provided a slug, returns associated post
export async function getPost(slug: string) {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  const html = marked(body)
  return { slug, html, title: attributes.title };
}
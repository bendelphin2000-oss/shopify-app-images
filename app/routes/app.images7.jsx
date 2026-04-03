import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
      {
        files(first: 100) {
          edges {
            node {
              ... on MediaImage {
                image {
                  url
                  width
                  height
                }
              }
            }
          }
        }
      }
    `);

    const json = await response.json();

    const images = json.data.files.edges
      .map(e => e.node.image)
      .filter(img => img && (img.width >= 1250 || img.height >= 1250))
      .map(img => ({
        ...img,
        size: img.width * img.height
      }))
      .sort((a, b) => b.size - a.size);

    return { images };

  } catch (e) {
    return {
      error: e.message
    };
  }
}

export default function ImagesPage() {
  const data = useLoaderData();

  if (data.error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Error</h1>
        <pre>{data.error}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Imágenes grandes</h1>

      {data.images.map((img, i) => (
        <div key={i}>
          {img.width} x {img.height}
        </div>
      ))}
    </div>
  );
}
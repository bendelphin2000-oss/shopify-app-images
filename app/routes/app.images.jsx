import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
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

  const data = await response.json();

  const images = data.data.files.edges
    .map(e => e.node.image)
    .filter(img => img && (img.width >= 1250 || img.height >= 1250))
    .map(img => ({
      ...img,
      size: img.width * img.height
    }))
    .sort((a, b) => b.size - a.size);

  return new Response(JSON.stringify(images), {
    headers: { "Content-Type": "application/json" },
  });
}

export default function ImagesPage() {
  const images = useLoaderData();

  return (
    <s-page heading="Large Images (1250px+)">
      <s-section>
        <s-stack gap="base">
          {images.map((img, i) => (
            <s-box key={i} padding="base" border="base" borderRadius="base">
              <s-stack direction="inline" gap="base" alignItems="center">
                
                {/* Imagen */}
                <s-image
                  src={img.url}
                  alt=""
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />

                {/* Info */}
                <s-stack gap="small">
                  <s-text variant="bodyMd">
                    {img.width} x {img.height}
                  </s-text>

                  <s-text tone="subdued" variant="bodySm">
                    {(img.size / 1000000).toFixed(2)} MP
                  </s-text>

                  <s-link href={img.url} target="_blank">
                    Open image
                  </s-link>
                </s-stack>

              </s-stack>
            </s-box>
          ))}
        </s-stack>
      </s-section>
    </s-page>
  );
}
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
              id
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
      .map(e => ({
        id: e.node.id,
        ...e.node.image
      }))
      .filter(img => img && (img.width > 1250 || img.height > 1250))
      .map(img => ({
        ...img,
        size: img.width * img.height
      }))
      .sort((a, b) => b.size - a.size);

    return { images };

  } catch (e) {
    return { error: e.message };
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

      {/* 🧱 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "15px"
        }}
      >
        {data.images.map((img, i) => {
          const id = img.id.split("/").pop();
          const isHuge = img.width > 3000 || img.height > 3000;

          return (
            <div
              key={i}
              style={{
                border: isHuge ? "2px solid red" : "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                background: "#fff"
              }}
            >
              {/* 🖼 Thumbnail */}
              <img
                src={img.url + "&width=300"}
                alt=""
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "4px"
                }}
              />

              {/* 📄 Info */}
              <div style={{ marginTop: "8px", fontSize: "13px" }}>
                <div>
                  {img.width} x {img.height}
                </div>

                <div style={{ color: "#666" }}>
                  {(img.size / 1000000).toFixed(2)} MP
                </div>

                {/* 🔗 Links */}
                <div style={{ marginTop: "5px" }}>
                  <a href={img.url} target="_blank">Ver</a>{" | "}

                  <a
                    href={`https://admin.shopify.com/store/rqandv-ya/content/files/${id}`}
                    target="_blank"
                  >
                    Editar
                  </a>
                </div>

                {/* 🔴 Aviso */}
                {isHuge && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    ⚠️ Muy grande
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
      {
        shop {
          name
        }
      }
    `);

    const data = await response.json();

    return {
      status: "OK",
      shop: data.data.shop.name
    };

  } catch (e) {
    return {
      status: "ERROR",
      error: e.message
    };
  }
}

export default function Page() {
  const data = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data.status}</h1>
      {data.shop && <p>Tienda: {data.shop}</p>}
      {data.error && <pre>{data.error}</pre>}
    </div>
  );
}
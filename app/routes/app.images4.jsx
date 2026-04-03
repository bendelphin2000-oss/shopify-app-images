import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);

    return { status: "AUTH OK" };

  } catch (e) {
    return {
      status: "AUTH ERROR",
      error: e.message,
    };
  }
}

export default function Page() {
  const data = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data.status}</h1>
      {data.error && <pre>{data.error}</pre>}
    </div>
  );
}
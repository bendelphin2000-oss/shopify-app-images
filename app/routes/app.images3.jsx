import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return { mensaje: "Hola desde loader 🚀" };
}

export default function ImagesPage() {
  const data = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data.mensaje}</h1>
    </div>
  );
}
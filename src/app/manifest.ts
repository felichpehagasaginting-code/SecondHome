import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Second Home Coffee Bekasi",
    short_name: "Second Home",
    description:
      "Tempat nongkrong kedua di Cibitung, Bekasi. Kopi premium mulai 5 ribuan — premium taste, pocket friendly price.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e7",
    theme_color: "#c8102e",
    lang: "id",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

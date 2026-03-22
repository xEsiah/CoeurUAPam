import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Middleware personnalisé pour le proxy d'images (plus robuste que server.proxy)
    {
      name: "image-proxy",
      configureServer(server) {
        server.middlewares.use("/api/proxy-image", async (req, res) => {
          try {
            // req.url contient uniquement la partie après /api/proxy-image (ex: /?url=...)
            const urlObj = new URL(req.url || "", `http://${req.headers.host}`);
            const targetUrl = urlObj.searchParams.get("url");

            if (!targetUrl) {
              res.statusCode = 400;
              res.end("URL missing");
              return;
            }

            // On récupère l'image avec un User-Agent "normal" pour éviter les blocages 403/404
            const response = await fetch(targetUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            });

            if (!response.ok) {
              res.statusCode = response.status;
              res.end(response.statusText);
              return;
            }

            // On transmet le type de contenu (ex: image/jpeg)
            const contentType = response.headers.get("content-type");
            if (contentType) res.setHeader("Content-Type", contentType);

            // On renvoie les données binaires
            const arrayBuffer = await response.arrayBuffer();
            res.write(Buffer.from(arrayBuffer));
            res.end();
          } catch (e) {
            console.error("Proxy error:", e);
            res.statusCode = 500;
            res.end("Internal Server Error");
          }
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api/facebook": {
        target: "https://graph.facebook.com/v19.0",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/facebook/, ""),
      },
    },
  },
});

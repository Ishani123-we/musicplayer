import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

// The music player is plain HTML/CSS/JS in public/player/. Home forwards there.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lo-fi Late Night — Music Player" },
      { name: "description", content: "A cozy lo-fi late night music player." },
      { property: "og:title", content: "Lo-fi Late Night — Music Player" },
      { property: "og:description", content: "A cozy lo-fi late night music player." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/player/index.html");
  }, []);
  return null;
}

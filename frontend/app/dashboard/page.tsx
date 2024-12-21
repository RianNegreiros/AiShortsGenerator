import { ImageCard } from "../components/ImageCard"

const images = [
  { src: "https://placehold.co/300x200/png", alt: "Image 1", title: "Image 1" },
  { src: "https://placehold.co/300x200/png", alt: "Image 2", title: "Image 2" },
  { src: "https://placehold.co/300x200/png", alt: "Image 3", title: "Image 3" },
  { src: "https://placehold.co/300x200/png", alt: "Image 4", title: "Image 4" },
  { src: "https://placehold.co/300x200/png", alt: "Image 5", title: "Image 5" },
  { src: "https://placehold.co/300x200/png", alt: "Image 6", title: "Image 6" },
]

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <ImageCard key={index} {...image} />
        ))}
      </div>
    </div>
  )
}


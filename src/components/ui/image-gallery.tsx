import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title?: string;
  description?: string;
}

export default function ImageGallery({ images, title, description }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        .image-gallery-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .image-gallery-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .image-gallery-wrapper {
            height: 350px;
            gap: 0.75rem;
          }
        }

        @media (min-width: 1024px) {
          .image-gallery-wrapper {
            height: 400px;
            gap: 1rem;
          }
        }

        .image-gallery-item {
          position: relative;
          flex: 1 1 0;
          height: 100%;
          min-width: 120px;
          max-width: 200px;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        @media (min-width: 640px) {
          .image-gallery-item {
            min-width: 150px;
            max-width: 250px;
          }
        }

        @media (min-width: 1024px) {
          .image-gallery-item {
            min-width: 180px;
            max-width: 300px;
          }
        }

        /* Hover effect - Desktop only */
        @media (min-width: 1024px) and (hover: hover) {
          .image-gallery-item:hover {
            flex: 3 1 0;
            min-width: 400px;
            max-width: 600px;
          }
        }

        .image-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .image-gallery-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        @media (min-width: 640px) {
          .image-gallery-title {
            font-size: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .image-gallery-title {
            font-size: 2.5rem;
          }
        }

        .image-gallery-description {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 2rem;
        }

        @media (min-width: 640px) {
          .image-gallery-description {
            font-size: 1rem;
            margin-bottom: 2.5rem;
          }
        }
      `}</style>

      <section className="w-full flex flex-col items-center justify-start py-8 md:py-12">
        {(title || description) && (
          <div className="max-w-3xl text-center px-4 mb-6 md:mb-8">
            {title && (
              <h1 className="image-gallery-title">{title}</h1>
            )}
            {description && (
              <p className="image-gallery-description">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Gallery */}
        <div className="image-gallery-container">
          <div className="image-gallery-wrapper">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="image-gallery-item"
              >
                <img
                  src={src}
                  alt={`Gallery image ${idx + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


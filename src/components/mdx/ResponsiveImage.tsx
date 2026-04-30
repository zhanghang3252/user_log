interface ResponsiveImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export default function ResponsiveImage({
  src,
  alt,
  caption,
  width,
  height,
}: ResponsiveImageProps) {
  return (
    <figure className="my-8 group">
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-zinc-400 dark:text-zinc-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface VideoEmbedProps {
  src: string;
  title?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export default function VideoEmbed({
  src,
  title = 'Embedded video',
  aspectRatio = '16:9',
}: VideoEmbedProps) {
  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

  return (
    <figure className="my-8">
      <div
        className={`relative overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm ${aspectClasses[aspectRatio]}`}
      >
        {isYouTube ? (
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <video
            src={src}
            controls
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {title && title !== 'Embedded video' && (
        <figcaption className="mt-3 text-center text-sm text-zinc-400 dark:text-zinc-500 italic">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

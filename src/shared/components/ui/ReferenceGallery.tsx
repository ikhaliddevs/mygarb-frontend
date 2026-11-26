import { useState } from 'react';

function ReferenceImage({ source, index }: { source: string; index: number }) {
  const [failed, setFailed] = useState(false);
  let safe = false;
  try {
    const url = new URL(source);
    safe = url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    /* Invalid sources use the same visible fallback. */
  }
  return (
    <div className="col-6 col-md-4">
      {failed || !safe ? (
        <p className="border rounded p-3">Reference image unavailable</p>
      ) : (
        <img
          src={source}
          alt={'Outfit reference ' + (index + 1)}
          className="img-fluid rounded"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function ReferenceGallery({ sources }: { sources: string[] }) {
  if (!sources.length) return <p>No reference images attached.</p>;
  return (
    <div className="row g-3">
      {sources.map((source, index) => (
        <ReferenceImage key={source} source={source} index={index} />
      ))}
    </div>
  );
}

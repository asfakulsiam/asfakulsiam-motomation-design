"use client";
// A credited figure with a loading tint and a visible fallback if the image fails to load.
// tier 0 · use-when: any credited photograph · avoid-when: decorative images without a credit · reduced-motion: no motion · touch: credit links are inline
import { useState } from "react";
import type { PhotoMeta } from "@/lib/photos";

type Props = { photo: PhotoMeta; caption?: string; eager?: boolean; className?: string; sizes?: string };

export function Photo({ photo, caption, eager, className }: Props) {
  const [failed, setFailed] = useState(false);
  const { src, alt, width, height, credit, href, licence, licenceUrl } = photo;
  return (
    <figure className={`photo ${className ?? ""}`}>
      <div className="photo__frame" style={{ aspectRatio: `${width} / ${height}` }}>
        {failed ? (
          <p className="photo__fallback">Photo didn&rsquo;t load: {alt}</p>
        ) : (
          <img src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" onError={() => setFailed(true)} />
        )}
      </div>
      <figcaption>
        {caption ? <span className="photo__caption">{caption}</span> : null}
        <span className="mono photo__credit">
          Placeholder photo by <a href={href}>{credit}</a>, <a href={licenceUrl}>{licence}</a>
        </span>
      </figcaption>
    </figure>
  );
}

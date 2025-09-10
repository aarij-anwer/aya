// src/components/Avatar.tsx
import React from 'react';

interface AvatarProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
  roundedFull?: boolean;
}

export default function Avatar({
  src,
  width,
  height,
  alt = '',
  roundedFull = false,
}: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`aspect-square object-cover outline-1 -outline-offset-1 outline-black/5 ${roundedFull ? 'rounded-full' : ''}`}
    />
  );
}

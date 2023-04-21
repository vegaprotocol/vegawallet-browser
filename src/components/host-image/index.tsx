import { useState } from "react";

export const HostImage = ({
  hostname,
  size = 16,
}: {
  hostname: string;
  size?: number;
}) => {
  const [imageUrl, setImageUrl] = useState<string>(`${hostname}/favicon.ico`);

  return (
    <img
      className={`w-${size} h-${size}`}
      alt={hostname}
      src={imageUrl}
      onError={() => setImageUrl("./question-mark.png")}
    />
  );
};

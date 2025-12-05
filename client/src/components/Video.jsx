import React from "react";

const Video = ({ src, ...props }) => {
  return (
    <video
      className="w-full h-full rounded-lg shadow-md border border-gray-200"
      controls
      src={src}
      {...props}
    />
  );
};

export default Video;

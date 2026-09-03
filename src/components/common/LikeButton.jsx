
import { useState } from "react";

function LikeButton() {
  const [liked, setLiked] = useState(false);

  function handleLike() {
    setLiked(!liked);
  }

  return (
    <button onClick={handleLike}>
      {liked ? "❤️ Liked" : "🤍 Like"}
    </button>
  );
}

export default LikeButton;
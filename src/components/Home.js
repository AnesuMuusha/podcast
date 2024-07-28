import React from "react";
import Podcasts from "./Podcasts";

function Home() {
  return (
    <div className="p-4 bg-gray-800">
      <div className="flex flex-col items-center space-y-2 pt-2">
        <h1 className="text-orange-400 text-5xl font-bold leading-tight text-center sm:text-2xl">8️⃣The 8 PM Podcast</h1>
      </div>
      <Podcasts/>
    </div>
  );
}

export default Home;

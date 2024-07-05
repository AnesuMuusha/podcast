import React from "react";
import Podcasts from "./Podcasts";

function Home() {
 

  return (
    <div>
      <div className="flex flex-row pt-2">
        <input placeholder="Search" className="border rounded"></input>
        <h4 className="text-red-700 px-16">The 8 PM podcast</h4>
     
      </div>
      <p className="pt-4">
        <hr></hr>
      </p>
     
      <Podcasts />
    </div>
  );
}

export default Home;
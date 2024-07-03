import React from "react";
import NavBar from "./NavBar";
import Podcasts from "./Podcasts";

function Home() {
  const Login = () => {
    alert("Logged in");
  };
  const SignUp = () => {
    alert("Use firebase ");
  };

  return (
    <div>
      <div className="flex flex-row pt-2">
        <input placeholder="Search" className="border rounded"></input>
        <h4 className="text-red-700 px-16">The 5 AM podcast</h4>
        <button
          onClick={Login}
          class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Log In
        </button>
        <h1>" "</h1>
        <button
          onClick={SignUp}
          class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Sign In
        </button>
      </div>
      <p className="pt-4">
        <hr></hr>
      </p>
     
      <Podcasts />
    </div>
  );
}

export default Home;
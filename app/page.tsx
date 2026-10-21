
import Image from "next/image";
import Link from "next/link"; 
import Navbar from "@/components/navbar";

const Home = () => {  
  
return (
  <div className="text-white grid grid-cols-[1fr_1fr] relative uppercase font-semibold hover:text-emerald-300 transition"> 
      <Image src={'/images/7.jpg'} width={200} height={500} className="w-[85%] h-[155%]" alt="home-page"/> 
    <div className="flex flex-start text-sky-400 flex-col mt-40 -ml-10">
      <h1 className="font-bold italic text-[4rem]">Confo</h1>
      <p className="font-semibold text-[2rem] flex-wrap"><span className="text-sky-50">Video Conference Rooms</span> For Office Teams, Students</p>
    </div>
  </div>
)}

export default Home

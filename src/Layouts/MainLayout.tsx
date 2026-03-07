import { Outlet } from "react-router-dom"
import Navbar from "../Components/GlobalComponents/Navbar"
import Footer from "../Components/GlobalComponents/Footer"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <Footer/>
    </>
  )
}

export default MainLayout
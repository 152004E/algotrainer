import { Outlet } from "react-router-dom"
import Navbar from "../Components/GlobalComponents/Navbar"
import Footer from "../Components/GlobalComponents/Footer"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="dark:bg-slate-900">
        <Outlet />
      </main>
      <Footer/>
    </>
  )
}

export default MainLayout
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import AdminSidebar from "./AdminSidebar";
import { useEffect } from "react";
import AdminHeader from "./AdminHeader";


export default function AdminMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "1") {
            nav("/")
        }
        
    }, [])
    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
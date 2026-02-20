import { Outlet, useNavigate } from "react-router-dom";
import FmSidebar from "./FmSidebar";
import FmHeader from "./FmHeader";
import { useEffect } from "react";

export default function FmMaster() {
   var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "3") {
            nav("/")
        }
        
    }, [])
    return (
        <>
            <FmHeader />
            <FmSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
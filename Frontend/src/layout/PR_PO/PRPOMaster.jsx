import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PRPOHeader from "./PRPOHeader";
import PRPOSidebar from "./PRPOSidebar";

export default function PRPOMaster() {
    var nav = useNavigate()
    useEffect( () => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "8") {
            nav("/")
        }

    }, [])
    return (
        <>
            <PRPOHeader />
            <PRPOSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ZCSidebar from "./ZCSidebar";
import ZCHeader from "./ZCHeader";

export default function ZCMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "9") {
            nav("/")
        }

    }, [])
    return (
        <>
            <ZCHeader />
            <ZCSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
import { Outlet, useNavigate } from "react-router-dom";
import ZhHeader from "./ZhHeader";
import ZhSidebar from "./ZhSidebar";
import { useEffect } from "react";

export default function ZhMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "5") {
            nav("/")
        }

    }, [])
    return (
        <>
            <ZhHeader />
            <ZhSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
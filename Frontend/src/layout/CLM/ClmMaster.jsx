import { Outlet, useNavigate } from "react-router-dom";
import ClmSidebar from "./ClmSidebar";
import ClmHeader from "./ClmHeader";
import { useEffect } from "react";

export default function ClmMaster() {
    var nav = useNavigate()
    useEffect( () => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "4") {
            nav("/")
        }

    }, [])
    return (
        <>
            <ClmHeader />
            <ClmSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
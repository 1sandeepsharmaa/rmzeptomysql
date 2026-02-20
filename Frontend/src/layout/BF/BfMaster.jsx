import { Outlet, useNavigate } from "react-router-dom";
import BfHeader from "./BfHeader";
import BfSidebar from "./BfSidebar";
import { useEffect } from "react";

export default function BfMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "6") {
            nav("/")
        }

    }, [])
    return (
        <>
            <BfHeader />
            <BfSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}
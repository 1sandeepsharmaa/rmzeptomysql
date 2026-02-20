import { Outlet, useNavigate } from "react-router-dom";
import BfHeader from "./ProcureHeader";
import BfSidebar from "./ProcureSidebar";
import { useEffect } from "react";

export default function ProcureMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "7") {
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
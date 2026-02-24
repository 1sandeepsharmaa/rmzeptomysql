import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminHeader from "../Admin Layout/AdminHeader";
import ViewerSidebar from "./ViewerSidebar";

export default function ViewerMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        // Allow userType 11 for Viewer
        if (!token || userType !== "11") {
            nav("/")
        }
    }, [nav])

    return (
        <>
            <AdminHeader />
            <ViewerSidebar />
            <Outlet />
        </>
    )
}

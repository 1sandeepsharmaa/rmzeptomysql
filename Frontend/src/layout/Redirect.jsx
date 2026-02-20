import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirect() {
    const nav = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userType = sessionStorage.getItem("userType");

        const routeMap = {
            "1":"/admin",
            "3": "/fm",
            "4": "/clm",
            "5": "/ZonalHead",
            "6": "/BusinessFinance",
            "7": "/Procurement",
            "8": "/PR_PO",
            "9": "/ZonalCommercial",
            "10": "/MissingBridge"
        };

        if (!token) {
            nav("/");
        } else {
            nav(routeMap[userType] || "/");
        }

    }, []);

    return null; 
}

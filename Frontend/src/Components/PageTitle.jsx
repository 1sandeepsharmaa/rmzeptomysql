import { Link } from "react-router-dom";

export default function PageTitle({ child }) {

    const userType = sessionStorage.getItem("userType");

    const homeRoutes = {
        "1": "/admin",
        "3": "/fm",
        "4": "/clm",
        "5": "/ZonalHead",
        "6": "/BusinessFinance",
        "7": "/Procurement",
        "8": "/PR_PO",
        "9": "/ZonalCommercial",
        "10": "/MissingBridge"
    };

    const homePath = homeRoutes[userType] || "/";

    return (
        <div className="pagetitle" style={{ cursor: "default" }}>
            <h1>{child}</h1>

            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to={homePath}>Home</Link>
                    </li>
                    <li className="breadcrumb-item active">{child}</li>
                </ol>
            </nav>
        </div>
    );
}

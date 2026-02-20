import { Link } from "react-router-dom";

export default function EmployeePageTitle({child}) {
    return (
        <>
            <div className="pagetitle">
                <h1>{child}</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/employee">Home</Link>
                        </li>
                        <li className="breadcrumb-item active">{child}</li>
                    </ol>
                </nav>
            </div>

        </>
    )
}
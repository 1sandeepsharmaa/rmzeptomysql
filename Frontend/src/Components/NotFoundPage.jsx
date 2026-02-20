import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    var nav=useNavigate()
    var token=sessionStorage.getItem("token")
    var userType=sessionStorage.getItem("userType")
    function homeFunction(e){
        e.preventDefault()
        if(!token){
            nav("/login")
        }
        else{
            if(userType==1){
                nav("/admin")
            }
            else{
                nav("/employee")
            }
        }
    }
    return (
        <>
                <div className="container-fluid">
                    <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                        <h1>404</h1>
                        <h2>The page you are looking for doesn't exist.</h2>
                        <Link className="btn" onClick={homeFunction}>
                            Back to home
                        </Link>
                        <img
                            src="/assets/img/not-found.svg"
                            className="img-fluid "
                            alt="Page Not Found"
                        />
                    </section>
                </div>
            

        </>
    )
}
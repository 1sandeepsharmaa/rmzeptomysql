import React from 'react';


export default function Footer() {
    {
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        return (
            <>
                {/* ======= Footer ======= */}
                <footer id="footer" className="footer">
                    <div className="copyright">
                        © Copyright{" "}
                        <strong>
                            @<span>कर्मIO</span>
                        </strong>
                        . All Rights Reserved
                    </div>
                    <button
                        className="back-to-top d-flex align-items-center justify-content-center"
                        onClick={scrollToTop}
                    >
                        <i className="bi bi-arrow-up-short" />
                    </button>

                </footer>
                {/* End Footer */}
            </>
        );
    }
}
import React from "react";

function Logo() {
    return (
        <div className='logo'>
            <img alt='logo' src={process.env.PUBLIC_URL + '/images/logo.png'}  />
        </div>
    )
}

export default Logo
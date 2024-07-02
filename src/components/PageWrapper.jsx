import React from 'react'

const PageWrapper = ({ title = "", children, className = "" }) => {
    return (
        <>
            <h2 className="text-xl uppercase pb-2.5 border-b-content-header-border border-b-2 font-medium">{title}</h2>
            <div className={`${className}`}>
                {children}
            </div>
        </>
    )
}

export default PageWrapper
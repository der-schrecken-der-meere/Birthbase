import React from 'react'

const PageWrapper = ({ title = "", children, className = "" }) => {
    return (
        <main className="px-5 py-2.5 flex flex-col gap-2.5">
            <h2 className="text-xl uppercase pb-2.5 border-b-content-header-border border-b-2 font-medium">{title}</h2>
            <div className={className}>
                {children}
            </div>
        </main>
    )
}

export default PageWrapper
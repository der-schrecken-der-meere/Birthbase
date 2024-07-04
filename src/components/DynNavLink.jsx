import React from 'react'
import { NavLink } from 'react-router-dom'

const DynNavLink = ({
  className = "", 
  icon, 
  isStatic = false, 
  hideText = false, 
  onClick, 
  to = "#", 
  title,
  link = true
}) => {

  const linkClass = ({ isActive }) => `${isActive && "text-nav-icons-active "} flex items-center transition-colors duration-300 ${!hideText && "gap-[15px]"}`;

  return (
    <>
      {link ? (
        <NavLink to={to} onClick={onClick} className={linkClass}>
          {icon}
          {!hideText && (
            <span>{title}</span>
          )}
        </NavLink>)
      : (
        <button onClick={onClick} className="transition-colors duration-300">
          {icon}
          {!hideText && (
            {title}
          )}
        </button>
      )} 
    </> 
  )
}

export default DynNavLink
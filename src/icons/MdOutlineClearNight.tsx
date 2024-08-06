import { I_MdOutlineProps } from "./icon";

const MdOutlineClearNight = ({
  color = "currentColor",
  size = "1em"
}: I_MdOutlineProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill='none' d="M0 0h24v24H0z"></path>
      <path d="M13.1 23C11.7 23 10.3875 22.7333 9.1625 22.2C7.9375 21.6667 6.87083 20.9458 5.9625 20.0375C5.05417 19.1292 4.33333 18.0625 3.8 16.8375C3.26667 15.6125 3 14.3 3 12.9C3 10.4667 3.775 8.32083 5.325 6.4625C6.875 4.60417 8.85 3.45 11.25 3C10.95 4.65 11.0417 6.2625 11.525 7.8375C12.0083 9.4125 12.8417 10.7917 14.025 11.975C15.2083 13.1583 16.5875 13.9917 18.1625 14.475C19.7375 14.9583 21.35 15.05 23 14.75C22.5667 17.15 21.4167 19.125 19.55 20.675C17.6833 22.225 15.5333 23 13.1 23ZM13.1 21C14.5667 21 15.925 20.6333 17.175 19.9C18.425 19.1667 19.4083 18.1583 20.125 16.875C18.6917 16.7417 17.3333 16.3792 16.05 15.7875C14.7667 15.1958 13.6167 14.3917 12.6 13.375C11.5833 12.3583 10.775 11.2083 10.175 9.925C9.575 8.64167 9.21667 7.28333 9.1 5.85C7.81667 6.56667 6.8125 7.55417 6.0875 8.8125C5.3625 10.0708 5 11.4333 5 12.9C5 15.15 5.7875 17.0625 7.3625 18.6375C8.9375 20.2125 10.85 21 13.1 21Z" fill={color}/>
    </svg>
  )
}

export default MdOutlineClearNight;

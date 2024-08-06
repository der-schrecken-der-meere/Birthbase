import { I_MdOutlineProps } from "./icon";

const MdOutlineSunny = ({
  color = "currentColor",
  size = "1em"
}: I_MdOutlineProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill='none' d="M0 0h24v24H0z"></path>
      <path d="M11 5V1H13V5H11ZM17.65 7.75L16.275 6.375L19.075 3.5L20.475 4.925L17.65 7.75ZM19 13V11H23V13H19ZM11 23V19H13V23H11ZM6.35 7.7L3.5 4.925L4.925 3.525L7.75 6.35L6.35 7.7ZM19.05 20.5L16.275 17.625L17.625 16.275L20.475 19.025L19.05 20.5ZM1 13V11H5V13H1ZM4.925 20.5L3.525 19.075L6.325 16.275L7.05 16.95L7.775 17.65L4.925 20.5ZM12 18C10.3333 18 8.91667 17.4167 7.75 16.25C6.58333 15.0833 6 13.6667 6 12C6 10.3333 6.58333 8.91667 7.75 7.75C8.91667 6.58333 10.3333 6 12 6C13.6667 6 15.0833 6.58333 16.25 7.75C17.4167 8.91667 18 10.3333 18 12C18 13.6667 17.4167 15.0833 16.25 16.25C15.0833 17.4167 13.6667 18 12 18ZM12 16C13.1 16 14.0417 15.6083 14.825 14.825C15.6083 14.0417 16 13.1 16 12C16 10.9 15.6083 9.95833 14.825 9.175C14.0417 8.39167 13.1 8 12 8C10.9 8 9.95833 8.39167 9.175 9.175C8.39167 9.95833 8 10.9 8 12C8 13.1 8.39167 14.0417 9.175 14.825C9.95833 15.6083 10.9 16 12 16Z" fill={color}/>
    </svg>
  )
}

export default MdOutlineSunny;

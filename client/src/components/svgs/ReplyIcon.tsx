import { LogoProps } from "../../utils/interfaces"

const ReplyIcon = (props: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.size}
    height={props.size}
    fill="white"
  >
    <path d="M141.5 62.5v-.1H113V10L22.7 92.5l90.2 82.5v-50.2h26.9c30.4 0 56.7 24.7 56.7 55.1 0 30.4-24.7 55-55.1 55v11c50.6 0 91.8-41.2 91.8-91.8.1-50-41.8-90.7-91.7-91.6zm59.1 146.3c4.3-8.8 6.9-18.5 6.9-28.9 0-35.9-30.4-65.1-66.1-65.9v-.1H102v3.5h-.1v32.7L39 92.6 101.9 35V73.3h37.9c44.6 0 82.4 36.2 82.4 80.8.1 21.2-8.3 40.3-21.6 54.7z" />
  </svg>
)
export default ReplyIcon

import Icon from "./icon-wrapper";
import GptSvg from "./assets/chatgpt.svg";


export default function GptIcon(props) {
    return (
      <Icon >
        <GptSvg {...props}/>
      </Icon>
    );
  }
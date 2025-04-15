import IconWrapper from "./icon-wrapper";
import TimerSvg from "./assets/timer.svg";

export default function Timer(props) {
    return (
      <IconWrapper {...props}>
        <TimerSvg  />
      </IconWrapper>
    );
  }
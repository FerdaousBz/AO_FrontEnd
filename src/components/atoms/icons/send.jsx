import SendSvg from './assets/sendmsg.svg';
import Icon from './icon-wrapper';

export default function Send(props) {
  return (
    <Icon {...props}>
      <SendSvg />
    </Icon>
  );
}

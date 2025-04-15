import ChatSvg from './assets/chat.svg';
import Icon from './icon-wrapper';

export default function ChatSidebar(props) {
  return (
    <Icon {...props}>
      <ChatSvg />
    </Icon>
  );
}

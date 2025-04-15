import LogoutSvg from './assets/logout.svg';
import Icon from './icon-wrapper';

export default function Logout(props) {
  return (
    <Icon {...props}>
      <LogoutSvg />
    </Icon>
  );
}

import SettingSvg from './assets/setting.svg';
import Icon from './icon-wrapper';

export default function Setting(props) {
  return (
    <Icon {...props}>
      <SettingSvg />
    </Icon>
  );
}

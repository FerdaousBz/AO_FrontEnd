import ReloadSvg from './assets/reload.svg';
import Icon from './icon-wrapper';

export default function Reload(props) {
  return (
    <Icon>
      <ReloadSvg {...props} />
    </Icon>
  );
}

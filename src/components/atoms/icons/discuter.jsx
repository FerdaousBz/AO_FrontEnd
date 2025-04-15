import DiscuterSvg from './assets/discuter.svg';
import Icon from './icon-wrapper';

export default function Discuter(props) {
  return (
    <Icon>
      <DiscuterSvg {...props} />
    </Icon>
  );
}

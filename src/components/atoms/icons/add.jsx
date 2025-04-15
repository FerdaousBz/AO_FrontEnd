import AddSvg from './assets/plus.svg';
import Icon from './icon-wrapper';

export default function Add(props) {
  return (
    <Icon>
      <AddSvg {...props} />
    </Icon>
  );
}

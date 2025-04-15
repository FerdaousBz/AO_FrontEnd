import VueSvg from './assets/vue.svg';
import Icon from './icon-wrapper';

export default function Vue(props) {
  return (
    <Icon>
      <VueSvg {...props} />
    </Icon>
  );
}

import PremiumSVG from './assets/ic-premium.svg';
import Icon from './icon-wrapper';

export default function Premium(props) {
  return (
    <Icon>
      <PremiumSVG {...props} />
    </Icon>
  );
}

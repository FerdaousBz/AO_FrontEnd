import ContributionSvg from './assets/contribution.svg';
import Icon from './icon-wrapper';

export default function Contribution(props) {
  return (
    <Icon {...props}>
      <ContributionSvg />
    </Icon>
  );
}

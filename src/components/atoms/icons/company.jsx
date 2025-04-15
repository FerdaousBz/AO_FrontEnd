import CompanySvg from './assets/company.svg';
import Icon from './icon-wrapper';

export default function Company(props) {
  return (
    <Icon>
      <CompanySvg {...props} />
    </Icon>
  );
}

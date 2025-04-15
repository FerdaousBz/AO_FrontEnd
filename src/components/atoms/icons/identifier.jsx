import IdentifierSVG from './assets/identifier.svg';
import Icon from './icon-wrapper';

export default function Identifier(props) {
  return (
    <Icon>
      <IdentifierSVG {...props} />
    </Icon>
  );
}

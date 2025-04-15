import ChevronSvg from './assets/chevron.svg';
import IconWrapper from './icon-wrapper';

export default function Chevron(props) {
  return (
    <IconWrapper {...props}>
      <ChevronSvg />
    </IconWrapper>
  );
}

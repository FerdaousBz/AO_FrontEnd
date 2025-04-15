import CloseSvg from './assets/close.svg';
import IconWrapper from './icon-wrapper';

export default function Close(props) {
  return (
    <IconWrapper {...props}>
      <CloseSvg />
    </IconWrapper>
  );
}

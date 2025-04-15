import EyeHideSvg from './assets/eye-hide.svg';
import IconWrapper from './icon-wrapper';

export default function EyeHide(props) {
  return (
    <IconWrapper {...props}>
      <EyeHideSvg />
    </IconWrapper>
  );
}

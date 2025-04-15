import ErrorSvg from './assets/error.svg';
import IconWrapper from './icon-wrapper';

export default function Error(props) {
  return (
    <IconWrapper {...props}>
      <ErrorSvg />
    </IconWrapper>
  );
}

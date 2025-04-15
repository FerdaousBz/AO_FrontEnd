import UserNoProfileSvg from './assets/userNoPhoto.svg';
import IconWrapper from './icon-wrapper';

export default function UserNoProfile(props) {
  return (
    <IconWrapper {...props}>
      <UserNoProfileSvg />
    </IconWrapper>
  );
}

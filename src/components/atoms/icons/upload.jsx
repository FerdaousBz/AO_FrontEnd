import UploadSvg from './assets/upload.svg';
import Icon from './icon-wrapper';

export default function Upload(props) {
  return (
    <Icon>
      <UploadSvg {...props} />
    </Icon>
  );
}

import DownloadSvg from './assets/download.svg';
import Icon from './icon-wrapper';

export default function Download(props) {
  return (
    <Icon {...props}>
      <DownloadSvg />
    </Icon>
  );
}

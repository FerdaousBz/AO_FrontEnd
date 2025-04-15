import ChevrondSVG from './assets/chevrond.svg';
import Icon from './icon-wrapper';

export default function Chevrond(props) {
  return (
    <Icon>
      <ChevrondSVG {...props} />
    </Icon>
  );
}

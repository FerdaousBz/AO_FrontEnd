import HomeSvg from './assets/home.svg';
import Icon from './icon-wrapper';

export default function Home(props) {
  return (
    <Icon {...props}>
      <HomeSvg />
    </Icon>
  );
}

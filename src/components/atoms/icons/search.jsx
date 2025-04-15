import SearchSvg from './assets/search.svg';
import Icon from './icon-wrapper';

export default function Search(props) {
  return (
    <Icon>
      <SearchSvg {...props} />
    </Icon>
  );
}

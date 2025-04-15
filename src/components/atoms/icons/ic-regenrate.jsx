  import IcRegenrateBtn from './assets/ic-regenrate.svg';
  import IconWrapper from './icon-wrapper';

  export default function IcRegenrate(props) {
    return (
      <IconWrapper {...props}>
        <IcRegenrateBtn
          width={props.width || '450px'}
          height={props.height || '450px'}/>
      </IconWrapper>
    );
  }

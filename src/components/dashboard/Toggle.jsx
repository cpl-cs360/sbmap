import './toggle.scss';
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

export default function Toggle({ color, name, isToggled, setIsToggled }) {
  return (
      <div className={`toggle ${color}`} onClick={ setIsToggled(!isToggled) }>
          { isToggled ?
            <CheckBox className='icon'/> : //on
            <CheckBoxOutlineBlank className='icon'/> //off
          }
          {name}
      </div>
  )
}

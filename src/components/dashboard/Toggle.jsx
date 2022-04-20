import './toggle.scss';
import CheckBox from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';


export default function Toggle({ color, name, id, ids, setIds }) {
  return (
      <span className={`toggle ${color}`} onClick={ () => toggle(id) }>
          { ids.includes(id) ?
            <CheckBox className='icon'/> : //on
            <CheckBoxOutlineBlank className='icon'/> //off
          }
          {name}
      </span>
  )

  function toggle(id) {
    if(ids.includes(id)) {
        // Remove it
        setIds(ids.filter(s => s != id))
    } else {
        // Add it
        setIds([...ids, id]);
    }
  }
}

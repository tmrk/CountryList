import { SelectAll, Deselect, Refresh } from '@mui/icons-material';

const HeaderTools = (props) => {
  
  const {fields, setFields, newSelectedCountry} = props;
  
  const selectAll = (all) => {
    for (let i = 0; i < fields.length; i++)  fields[i].excluded = !all;
    setFields([...fields]);
    localStorage.setItem('fields', JSON.stringify(fields));
  };

  return (
    <ul className='header tools'>
      <li 
        className='deselect'
        onPointerDown={() => selectAll(false)}
      >
        <Deselect />
        <span>Deselect all</span>
      </li>

      <li 
        className='selectall'
        onPointerDown={() => selectAll(true)}
      >
        <SelectAll />
        <span>Select all</span>
      </li>

      <li 
        className='refresh'
        onPointerDown={() => newSelectedCountry({random: true})}
      >
        <Refresh />
        <span>Random country</span>
      </li>
    </ul>
  );

};

export default HeaderTools;
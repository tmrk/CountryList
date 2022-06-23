import { SelectAll, Deselect, Refresh } from '@mui/icons-material';

const HeaderTools = (props) => {
  
  const {fields, setFields, newSelectedCountry} = props;

  return (
    <ul className='header tools'>
      <li 
        className='deselect'
        onPointerDown={() => {
        for (let i = 0; i < fields.length; i++)  fields[i].excluded = true;
        setFields([...fields]);
        localStorage.setItem('fields', JSON.stringify(fields));
        }}
      >
        <Deselect />
        <span>Deselect all</span>
      </li>

      <li 
        className='selectall'
        onPointerDown={() => {
        for (let i = 0; i < fields.length; i++)  fields[i].excluded = false;
        setFields([...fields]);
        localStorage.setItem('fields', JSON.stringify(fields));
        }}
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
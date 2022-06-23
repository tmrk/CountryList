import { Check } from '@mui/icons-material';

const FieldOption = (props) => {
  const {field, fields, setFields, last} = props;
  const valueType = props.countryValue ? typeof props.countryValue : 'undefined';

  const countryValue = props.countryValue ? JSON.stringify(props.countryValue).replace(/\\/g, '') : '';

  const handleClick = () => {
    field.excluded = !field.excluded;
    setFields([...fields]);
    localStorage.setItem('fields', JSON.stringify(fields));
  }

  return (
    <li 
      className={field.excluded ? 'excluded' : ''}
      onPointerDown={handleClick}
    >
      <span 
        className='checkbox' 
        data-checked='true'
      >
        {field.excluded ? '' : <Check />}
      </span>
      <span className='key'>"{field.name}"</span>
      <span className='colon'>:&nbsp;</span> 
      <span className={'value ' + valueType}>
        {countryValue ? countryValue.toString() : 'undefined'}
      </span>
      {last ? '' : <span className='comma'>,</span>}
    </li>
  );
}

export default FieldOption;
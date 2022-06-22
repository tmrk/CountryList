import { ReactComponent as Checkmark } from '../assets/check.svg';

const FieldOption = (props) => {
  const {field, fields, setFields, last} = props;
  const valueType = props.countryValue ? typeof props.countryValue : 'undefined';

  const countryValue = Array.isArray(props.countryValue) ? 
    '[' + props.countryValue.join(', ') + ']'
    : props.countryValue;

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
        {field.excluded ? '' : <Checkmark />}
      </span>
      <span className='key'>"{field.name}"</span>
      <span className='colon'>:&nbsp;</span> 
      <span className={'value ' + valueType}>
        {valueType === 'string' ? '"' : ''}
        {countryValue ? countryValue.toString() : 'undefined'}
        {valueType === 'string' ? '"' : ''}
      </span>
      {last ? '' : <span className='comma'>,</span>}
    </li>
  );
}

export default FieldOption;
import { useState, useEffect } from 'react';
import './App.scss';

const jsonAddress = 'https://gist.githubusercontent.com/tmrk/3ba1cc679e9f655143593524a203b7e2/raw/40436639265c4b85be9c1d886537432b39b71b4d/countries.json';


const FieldOption = (props) => {
  const {field, fields, setFields, countryValue, last} = props;
  const valueType = countryValue ? typeof countryValue : 'undefined';

  const handleClick = () => {
    field.excluded = !field.excluded;
    setFields([...fields]);
    console.log('foo');
  }

  return (
    <li className={field.excluded ? 'excluded' : ''}>
      <span 
        className='checkbox' 
        data-checked='true'
        onPointerDown={handleClick}
      ></span>
      <span className='key'>"{field.name}"</span>
      <span className='colon'>: </span> 
      <span className={'value ' + valueType}>
        {valueType === 'string' ? '"' : ''}
        {countryValue ? countryValue.toString() : 'undefined'}
        {valueType === 'string' ? '"' : ''}
      </span>
      {last ? '' : <span className='comma'>,</span>}
    </li>
  );
}

const FieldSelect = (props) => {
  const {fields, setFields, countries} = props;
  const country = countries.length && countries[Math.floor(Math.random() * countries.length)];

  let maxFieldLength = 0;
  for (let i = 0; i < fields.length; i++) {
    if (maxFieldLength < fields[i].length) maxFieldLength = fields[i].length;
  }
  return (
    <pre>
      <span className='bracket'>&#123;</span>
      <ul>
        {fields.length ? 
          fields.map((field, index) => 
          <FieldOption 
            key={index} 
            field={field}
            fields={fields}
            setFields={setFields}
            countryValue={country[field.name] ? country[field.name] : ''}
            last={index + 1 === fields.length}
          />
        )
        : ''}
      </ul>
      <span className='bracket'>&#125;</span>
    </pre>
  );
};

function App() {

  const [countries, setCountries] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {

    const processSourceCountries = (sourceCountries) => {
      setCountries(sourceCountries);

      for (let i = 0; i < sourceCountries.length; i++) {
        const country = sourceCountries[i];
        for (const field in country) {
          if (Object.hasOwnProperty.call(country, field)) {
            let found = false;
            for (let j = 0; j < fields.length; j++) {
              if (fields[j].name === field) {
                found = true;
                break;
              }
            }
            if (!found) fields.push({name: field});
          }
        }
      }
      setFields([...fields]);
    }

    async function fetchData() {
      await fetch(jsonAddress)
        .then(response => response.json())
        .then(response => {
          console.log('fetching');
          processSourceCountries(response);
          localStorage.setItem('countries', JSON.stringify(response));
        });
    }

    if (localStorage.getItem('countries')) {
      console.log('Loaded from localStorage');
      processSourceCountries(JSON.parse(localStorage.getItem('countries')));
    } else {
      console.log('Loaded from online JSON');
      fetchData();
    }

  }, []);

  return (
    <div className="App">
      
      {/* <ul>
        {countries.length ?
          countries.map((country, index) => <li key={index}>{country.name}</li>)
        : ''}
      </ul> */}
      
      <FieldSelect 
        fields={fields}
        setFields={setFields}
        countries={countries}
      />
    </div>
  );
}

export default App;

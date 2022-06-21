import { useState, useEffect } from 'react';
import './App.scss';
import { ReactComponent as Checkmark } from './assets/check.svg';
import { ReactComponent as Refresh } from './assets/refresh.svg';
import { ReactComponent as SelectAll } from './assets/select_all.svg';
import { ReactComponent as Deselect } from './assets/deselect.svg';
import { ReactComponent as FileDownload } from './assets/file_download.svg';

const jsonAddress = 'https://gist.githubusercontent.com/tmrk/3ba1cc679e9f655143593524a203b7e2/raw/40436639265c4b85be9c1d886537432b39b71b4d/countries.json';

const FieldOption = (props) => {
  const {field, fields, setFields, countryValue, last} = props;
  const valueType = countryValue ? typeof countryValue : 'undefined';

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

const FieldSelect = (props) => {
  const {countries, fields, setFields, selectedCountry, newSelectedCountry} = props;

  let maxFieldLength = 0;

  for (let i = 0; i < fields.length; i++) {
    if (maxFieldLength < fields[i].length) maxFieldLength = fields[i].length;
  }
  return (
    <div className='fieldselect'>
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
      <span className='comment'>// Example country:</span>
      <span className='bracket'>&#123;</span>
      <ul className='fields'>
        {fields.length ? 
          fields.map((field, index) => 
          <FieldOption 
            key={index} 
            field={field}
            fields={fields}
            setFields={setFields}
            countryValue={selectedCountry[field.name] ? selectedCountry[field.name] : ''}
            last={index + 1 === fields.length}
          />
        )
        : ''}
      </ul>
      <span className='bracket'>&#125;</span>
      <ul className='footer tools'>
        <li 
          className='download'
          onPointerDown={() => {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            const data = JSON.stringify(countries.map(country => {
              const newCountry = {};
              for (let i = 0; i < fields.length; i++) {
                if (!fields[i].excluded && country[fields[i].name]) {
                  newCountry[fields[i].name] = country[fields[i].name];
                }
              }
              if (Object.keys(newCountry).length) return newCountry; // needs be fixed to skip null
            }));
            let blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'countries_' +
              new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0]
              + '.json';
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          }}
        >
          <FileDownload />
          <span>Download in JSON</span>
        </li>
      </ul>
    </div>
  );
};


function App() {

  const [countries, setCountries] = useState([]);
  const [fields, setFields] = useState(
    //JSON.parse(localStorage.getItem('fields')) || 
    []
  );
  const [selectedCountry, setSelectedCountry] = useState();

  const newSelectedCountry = (props) => {
    const listOfCountries = props.countries || countries;
    const newCountry = props.random ?
      listOfCountries[Math.floor(Math.random() * listOfCountries.length)] :
      listOfCountries[0];
    setSelectedCountry(newCountry);
  };

  useEffect(() => {

    const processSourceCountries = (sourceCountries) => {
      setCountries(sourceCountries);
      newSelectedCountry({countries: sourceCountries, random: true});

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
    <div className="container">
      <header>
        <h1>CountryList</h1>
      </header>
      
      {/* <ul>
        {countries.length ?
          countries.map((country, index) => <li key={index}>{country.name}</li>)
        : ''}
      </ul> */}
      
      <FieldSelect 
        countries={countries}
        fields={fields}
        setFields={setFields}
        selectedCountry={selectedCountry}
        newSelectedCountry={newSelectedCountry}
      />
      <footer>
        <p>
          &#128073;&nbsp;
          <a href='https://github.com/tmrk/CountryList'>github.com/tmrk/CountryList</a>
        </p>
      </footer>
    </div>
  );
}

export default App;

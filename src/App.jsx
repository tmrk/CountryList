import { useState, useEffect } from 'react';
import './App.scss';
import RegionSelect from './components/RegionSelect';
import FieldSelect from './components/FieldSelect';

const countriesJSON = 'https://gist.githubusercontent.com/tmrk/3ba1cc679e9f655143593524a203b7e2/raw/countries.json';
const regionsJSON = 'https://gist.githubusercontent.com/tmrk/3ba1cc679e9f655143593524a203b7e2/raw/regions.json';

function App() {

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
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
      await fetch(countriesJSON)
        .then(response => response.json())
        .then(response => {
          console.log('fetching countries');
          processSourceCountries(response);
          localStorage.setItem('countries', JSON.stringify(response));
        });

      await fetch(regionsJSON)
        .then(response => response.json())
        .then(response => {
          console.log('fetching regions');
          setRegions(response);
          localStorage.setItem('regions', JSON.stringify(response));
        });
    }

    if (localStorage.getItem('countries') && localStorage.getItem('regions')) {
      console.log('Loaded from localStorage');
      processSourceCountries(JSON.parse(localStorage.getItem('countries')));
      setRegions(JSON.parse(localStorage.getItem('regions')))
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
      <main>
        <RegionSelect 
          regions={regions}
          setRegions={setRegions}
        />
        <FieldSelect 
          countries={countries}
          fields={fields}
          setFields={setFields}
          selectedCountry={selectedCountry}
          newSelectedCountry={newSelectedCountry}
        />
      </main>
      <footer>
        <p>
          &#128073;&nbsp;
          <a href='https://github.com/tmrk/CountryList'>github.com/tmrk/CountryList</a>
        </p>
      </footer>
      {/* <ul>
        {countries.length ?
          countries.map((country, index) => <li key={index}>{country.name}</li>)
        : ''}
      </ul> */}
    </div>
  );
}

export default App;

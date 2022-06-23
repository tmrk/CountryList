import FieldOption from '../components/FieldOption';
import HeaderTools from '../components/HeaderTools';
import { FileDownload } from '@mui/icons-material';

const FieldSelect = (props) => {
  const {countries, regions, fields, setFields, selectedCountry, newSelectedCountry} = props;

  const exportCountries = () => {

    // this is buggy, need a better solution...
    const isIncluded = (country) => {
      let excluded = false;
      for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        if (country.intermediateRegion 
            && country.intermediateRegion === region.m49code) {
          if (region.excluded) {
            excluded = true;
            break;
          }
        } else if (country.subRegion 
          && country.subRegion === region.m49code) {
          if (region.excluded) {
            excluded = true;
            break;
          }
        } else if (country.region 
          && country.subRegion === region.m49code) {
          if (region.excluded) {
            excluded = true;
            break;
          }
        }
      }
      return !excluded;
    };

    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    const filtered = countries.filter(country => isIncluded(country));
    const data = JSON.stringify(filtered.map(country => {
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
  };

  let maxFieldLength = 0;

  for (let i = 0; i < fields.length; i++) {
    if (maxFieldLength < fields[i].length) maxFieldLength = fields[i].length;
  }
  return (
    <div className='fieldselect'>
      <h2>Select fields to include</h2>
      <HeaderTools 
        fields={fields}
        setFields={setFields}
        newSelectedCountry={newSelectedCountry}
      />
      <span className='comment'>&#47;&#47; Example country:</span>
      <span className='bracket'>&#123;</span>
      <ul className='fields checklist'>
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
          onPointerDown={exportCountries}
        >
          <FileDownload />
          <span>Download in JSON</span>
        </li>
      </ul>
    </div>
  );
};

export default FieldSelect;
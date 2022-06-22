import FieldOption from '../components/FieldOption';
import { ReactComponent as Refresh } from '../assets/refresh.svg';
import { ReactComponent as SelectAll } from '../assets/select_all.svg';
import { ReactComponent as Deselect } from '../assets/deselect.svg';
import { ReactComponent as FileDownload } from '../assets/file_download.svg';

const FieldSelect = (props) => {
  const {countries, fields, setFields, selectedCountry, newSelectedCountry} = props;

  let maxFieldLength = 0;

  for (let i = 0; i < fields.length; i++) {
    if (maxFieldLength < fields[i].length) maxFieldLength = fields[i].length;
  }
  return (
    <div className='fieldselect'>
      <h2>Select fields to include</h2>
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

export default FieldSelect;
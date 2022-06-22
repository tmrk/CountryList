import { ReactComponent as Checkmark } from '../assets/check.svg';

const RegionSelect = (props) => {

  const {regions, setRegions} = props;


  return (
    <div className='regionselect'>
      <h2>Select regions</h2>
      <ul className="regions checklist">
        {regions && regions.length ? 
          regions.map((region, index) => {

            const handleClick = () => {
              region.excluded = !region.excluded;
              setRegions([...regions]);
              localStorage.setItem('regions', JSON.stringify(regions));
            }

            return (<li 
              key={index}
              className={region.excluded ? 'excluded' : ''}
              onPointerDown={handleClick}
            >
              <span 
                className='checkbox' 
                data-checked='true'
              >
                {region.excluded ? '' : <Checkmark />}
              </span>
              <span className="name">
                {region.name}
              </span>
            </li>);
          })
        : ''}
      </ul>
    </div>
  );

};

export default RegionSelect;
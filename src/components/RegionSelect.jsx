import { Check } from '@mui/icons-material';

const RegionSelect = (props) => {

  const {regions, setRegions} = props;


  return (
    <div className='regionselect'>
      <h2>Select regions</h2>
      <ul className="regions checklist">
        {regions && regions.length ? 
          regions.map((region, index) => {

            const handleClick = () => {
              const toggleRegions = (thisRegion, bool) => {
                thisRegion.excluded = bool;
                if (thisRegion.comprises) for (let i = 0; i < thisRegion.comprises.length; i++) {
                  const subM49code = thisRegion.comprises[i];
                  for (let j = 0; j < regions.length; j++) {
                    if (regions[j].m49code === subM49code) {
                      toggleRegions(regions[j], bool);
                    }
                  }
                }
              };
              toggleRegions(region, !region.excluded);              
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
                {region.excluded ? '' : <Check />}
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
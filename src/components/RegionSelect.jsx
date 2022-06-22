const RegionSelect = (props) => {

  const {regions} = props;

  return (
    <div className='regionselect'>
      <h2>Select regions</h2>
      <ul>
        {regions && regions.length ? 
          regions.map((region, index) => 
            <li key={index}>{region.name}</li>
          )
        : ''}
      </ul>
    </div>
  );

};

export default RegionSelect;
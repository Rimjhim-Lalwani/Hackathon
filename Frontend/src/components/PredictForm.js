import React, {useState,useEffect} from 'react';

const PredictionForm = () => {
  const [salesFirstMonth, setSalesFirstMonth] = useState('');
  const [salesSecondMonth, setSalesSecondMonth] = useState('');  const handleOpenApp = () => {
    const queryParams = `sales_first_month=${encodeURIComponent(salesFirstMonth)}&sales_second_month=${encodeURIComponent(salesSecondMonth)}`;
    window.open(`http://localhost:5000/predict?${queryParams}`, '_blank');
  };

  return (
    <div>
      <input className="w-23 m-2 " type="text" value={salesFirstMonth} onChange={(e) => setSalesFirstMonth(e.target.value) }  />
      <input  className="w-22 m-5" type="text" value={salesSecondMonth} onChange={(e) => setSalesSecondMonth(e.target.value)}  />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded" onClick={handleOpenApp}>Predict nth day sales</button>
    </div>
  );
};

export default PredictionForm;
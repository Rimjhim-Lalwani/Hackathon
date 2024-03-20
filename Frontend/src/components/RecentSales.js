import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentSales = ({ productId, setSalesFirstMonth, setSalesSecondMonth }) => {
  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/sales/recent-sales/${productId}`);
        const recentSalesData = response.data;
        console.log(response.data);
        if (recentSalesData.length >= 2) {
          setSalesFirstMonth(recentSalesData[0].sales);
          setSalesSecondMonth(recentSalesData[1].sales);
        }
      } catch (error) {
        console.error('Error fetching recent sales:', error);
      }
    };

    fetchRecentSales();
  }, [productId, setSalesFirstMonth, setSalesSecondMonth]);

  return null; // Since this component doesn't render anything, returning null
};
export default RecentSales;

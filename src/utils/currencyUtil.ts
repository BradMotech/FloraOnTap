// currencyUtil.js
export const formatToRands = (amount) => {
    if (isNaN(amount)) return 'R0.00'; // Return a default value if amount is not a number
  
    return `R ${parseFloat(amount).toFixed(2)}`;
  };
  
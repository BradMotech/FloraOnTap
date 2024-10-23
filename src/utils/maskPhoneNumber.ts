export const maskPhoneNumber = (phone) => {
    if (!phone || phone.length !== 10) return phone;
    // Mask the 4th to 7th digits
    return phone.slice(0, 3) + "****" + phone.slice(7);
  };


  export const maskText = (text) => {
    if (!text) return text;
    // Mask the 4th to 7th digits
    return text.slice(0, 3) + "****" + text.slice(text.length);
  };
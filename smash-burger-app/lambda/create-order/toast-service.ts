import axios from 'axios';

// Helper to get token (could add caching logic here later)
export const getToastToken = async () => {
  const res = await axios.post('https://ws-api.toasttab.com/authentication/v1/authentication/login', {
    clientId: process.env.TOAST_CLIENT_ID,
    clientSecret: process.env.TOAST_CLIENT_SECRET,
    userAccessType: "TOAST_MACHINE_CLIENT"
  });
  return res.data.token.accessToken;
};

// Helper to actually post the order
export const submitToastOrder = async (token: string, payload: any) => {
  const res = await axios.post(
    `https://ws-api.toasttab.com/orders/v2/orders/${process.env.RESTAURANT_GUID}`, 
    payload, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
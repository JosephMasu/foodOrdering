import { Alert } from 'react-native';
import { supabase } from './supabase';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';

const fetchPaymentSheetParams = async (amount: number) => {
  try {
    const session = await supabase.auth.getSession();
    const access_token = session.data.session?.access_token;

    if (!access_token) {
      Alert.alert('Error', 'User is not authenticated');
      return {};
    }

    const { data, error } = await supabase.functions.invoke('payment-sheet', {
      body: { amount },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (error) {
      console.error('Supabase Function Error:', error);
      Alert.alert('Error', error.message);
      return {};
    }

    if (data) {
      console.log('Payment Sheet Params:', data);
      return data;
    }

    Alert.alert('Error', 'No data returned from payment function');
    return {};
  } catch (err) {
    console.error('Unexpected error fetching payment sheet params:', err);
    Alert.alert('Unexpected error occurred');
    return {};
  }
};


export const initialisePaymentSheet = async (amount: number) => {
  console.log('Initialising payment sheet, for: ', amount);

  const { paymentIntent, publishableKey, customer, ephemeralKey } =
    await fetchPaymentSheetParams(amount);

  if (!paymentIntent || !publishableKey) return;

  const result = await initPaymentSheet({
    merchantDisplayName: 'Masu Dev', 
    returnURL: 'myapp://stripe-redirect', // This must match the scheme above
    paymentIntentClientSecret: paymentIntent,
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    defaultBillingDetails: {
      name: 'MASU JOE',
    },
  });
  console.log(result);
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    Alert.alert(error.message);
    return false;
  }
  return true;
};
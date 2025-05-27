import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from '../lib/notification';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const {profile} = useAuth();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.Subscription>(null);
  const responseListener = useRef<Notifications.Subscription>(null);

  const savePushToken = async (newToken: string | undefined) => {
    console.log(newToken);

    if(!newToken) return;

    setExpoPushToken(newToken)

    await supabase.from('profiles').update({expo_push_token: newToken}).eq('id', profile.id)
  };


  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
        savePushToken(token)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  console.log(expoPushToken);
  console.log(notification);


  return <>{children}</>;
};

export default NotificationProvider;

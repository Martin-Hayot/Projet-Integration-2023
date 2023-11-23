import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IonPage, 
         IonHeader, 
         IonToolbar, 
         IonTitle, 
         IonContent, 
         IonIcon, 
         IonLabel, 
         IonButton,
         IonButtons
        } from '@ionic/react';
import { person } from 'ionicons/icons';
import { Navbar } from '../components'

const Dashboard: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [aquariums, setAquariums] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [buttonState, setButtonState] = useState<string>("");

  const onLoad = async () => {
    const userId = localStorage.getItem('userId');

    try {
      const userResponse = await axios.get(`http://localhost:3001/api/notification/user/${userId}`);
      setUserInfo(userResponse.data);
      const aquariumResponse = await axios.get(`http://localhost:3001/api/notification/aquarium/${userId}`);
      setAquariums(aquariumResponse.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    onLoad();
  }, []);

  const handleAquariumClick = async (aquariumName: string) => {
    try {
      const userId = localStorage.getItem('userId');
  
      const notificationResponse = await axios.get(`http://localhost:3001/api/notification/Notifications/${userId}`);
      const notifications = notificationResponse.data.notifications;
  
      const aquariumNotifications = notifications.filter(
        (notification: { aquarium: string; component: string; message: string }) => notification.aquarium === aquariumName
      );
  
      // Utiliser la variable 'status' pour déterminer l'état de l'aquarium
      const status = !aquariumNotifications.some(
        (notif: { component: string; message: string; style?: string }) => notif.style === 'success'
      )
  
      if (!status) {
        setToastMessage(`${aquariumName} est en parfait état. Bravo !`);
      } else {
        const notificationMessages = aquariumNotifications.map(
          (notif: { aquarium: string; component: string; message: string; style?: string }) => (
            `${notif.message}`
          )
        );
        setToastMessage(`\n${notificationMessages.join('\n')}`);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };
  
  return (
    <IonPage className="bg-rose-200 p-4">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
            <IonButtons slot="end">
            <IonButton routerLink="/">Home</IonButton>
            <IonButton routerLink="/about">About</IonButton>
            <IonButton routerLink="/contact">Contact</IonButton>
            </IonButtons>
            {userInfo && (
                  <div className="flex items-center justify-end pr-10">
                    <IonIcon icon={person} />
                    <IonLabel>Bonjour {userInfo.firstname} {userInfo.lastname}</IonLabel>
                  </div>
                )}
        </IonToolbar>
      </IonHeader>
      <IonContent className="custom-bg-color p-4">
        <div className="ml-20 mr-20">
          <div className="border-gray-150 pr-5 mr-5">
            <p className="mb-4">Liste des aquariums :</p>
            <ul className="">
              {aquariums.map((aquarium, index) => (
                <li key={index} className="flex items-center justify-center h-[50px] w-[150px]">
                <IonButton
                  onClick={() => handleAquariumClick(aquarium)}
                  onMouseEnter={() => setButtonState("hover")}
                  onMouseLeave={() => setButtonState("")}
                  className={`transition-colors duration-300 ${buttonState === "hover" ? "bg-blue-200" : "bg-blue-100"} hover:bg-gray-300 focus:bg-blue-300`}
                >
                  {aquarium}
                </IonButton>
              </li>
              
              ))}
            </ul>
          </div>
        </div>
        {toastMessage && <div className="toast">{toastMessage}</div>}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

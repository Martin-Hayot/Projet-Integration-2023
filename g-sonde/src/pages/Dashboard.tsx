import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonLabel } from '@ionic/react';
import { person } from 'ionicons/icons';

const Dashboard: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [aquariums, setAquariums] = useState<string[]>([]);

  const onLoad = async () => {
    const userId = localStorage.getItem('userId');
  
    try {
      // Information utilisateur
      const userResponse = await axios.get(`http://localhost:3001/api/notification/user/${userId}`);
      setUserInfo(userResponse.data);

      // Liste des aquariums
      const aquariumResponse = await axios.get(`http://localhost:3001/api/notification/aquarium/${userId}`);
      setAquariums(aquariumResponse.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Appelle onLoad lorsque le composant est monté
  useEffect(() => {
      onLoad();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          {userInfo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
              <IonIcon icon={person} />
              <br></br>
              <IonLabel>Bonjour {userInfo.firstname} {userInfo.lastname}</IonLabel>
            </div>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Liste des aquariums :</p>
        <ul>
          {aquariums.map((aquarium, index) => (
            <li key={index}>{aquarium}</li>
          ))}
        </ul>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

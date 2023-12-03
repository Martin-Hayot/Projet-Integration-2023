import {
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonMenu,
	IonMenuButton,
	IonPage,
	IonSplitPane,
	IonTitle,
	IonToolbar,
	isPlatform,
	IonLabel,
	IonIcon,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { UserContext } from '../../components';
import { person } from 'ionicons/icons';
import Navbar from '../../components/Navbar';

const DashboardPage: React.FC = () => {
	const [userInfo, setUserInfo] = useState<any | null>(null);
	const [aquariums, setAquariums] = useState<string[]>([]);
	const [toastMessage, setToastMessage] = useState<string>("");
	//const [buttonState, setButtonState] = useState<string>("");
  
	const onLoad = async () => {
	  const userId = localStorage.getItem('userId');  
	  try {
		const userResponse = await axios.get(`http://localhost:3001/api/notification/user/${userId}`);
		setUserInfo(userResponse.data);
		const aquariumResponse = await axios.get(`http://localhost:3001/api/notification/aquarium/${userId}`);
		setAquariums(aquariumResponse.data);
		console.log('Ses aqua sont: ',(aquariumResponse.data))
	  } catch (error) {
		console.error("Error fetching data", error);
	  }
	};
	useEffect(() => {
	  onLoad();
	}, []);
  
	
	
	return (
	  <IonPage>
		<IonHeader>
		  <IonToolbar>
			  <Navbar/>
			  {userInfo && (
					<div className="flex items-center justify-end pr-10">
					  <IonIcon icon={person} />
					  <IonLabel>Bonjour {userInfo.firstname} {userInfo.lastname}</IonLabel>
					</div>
				  )}
		  </IonToolbar>
		</IonHeader>
		<IonContent className="p-4">
		  <div className="ml-20 mr-20">
			<div className="border-gray-150 pr-5 mr-5">
			  <p className="mb-4">Liste des aquariums :</p>
			  <ul>
              {aquariums.map((aquarium, index) => (
                <li key={index} className="flex items-center justify-center h-[50px] w-[150px]">
                  {aquarium}
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
  
export default DashboardPage;

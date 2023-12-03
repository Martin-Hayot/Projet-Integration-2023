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
			<Navbar/>
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
		  <div className="ml-7 mr-7">
			<div>
				<p className="mb-2">Liste des aquariums :</p>
				<ul>
					{aquariums.map((aquarium, index) => (
					<li key={index}>{aquarium}</li>
					))}
				</ul>
			</div>
		  </div>
		</IonContent>
	  </IonPage>
	);
  };
export default Dashboard  
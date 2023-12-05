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
	//const [toastMessage, setToastMessage] = useState<string>("");
	const [buttonState, setButtonState] = useState<string>("");
	const [toastMessage, setToastMessage] = useState<React.ReactNode | null>(null);
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
  
	// Appel onLoad lorsque le composant est monté
	useEffect(() => {
		onLoad();
	}, []);

	const handleAquariumClick = async (aquariumName: string) => {
		try {
		  const userId = localStorage.getItem('userId');
	  
		  const notificationResponse = await axios.get(`http://localhost:3001/api/notification/notifications/${userId}`);
		  const notifications = notificationResponse.data.notifications;
	  
		  const aquariumNotifications = notifications.filter(
			(notification: { aquarium: string; component: string; message: string; style?: string }) => notification.aquarium === aquariumName
		  );
	  
		  // Utilisation la variable 'status' pour déterminer l'état de l'aquarium
		  const hasSuccessNotification = aquariumNotifications.some(
			(notif: { component: string; message: string; style?: string }) => notif.style === 'success'
		  );
		
		  if (hasSuccessNotification) {
			setToastMessage(
			  <div>
				{`${aquariumName} est en parfait état. Bravo !`}
			  </div>
			);
		  } else {
			const notificationMessages = aquariumNotifications.map(
			  (notif: { aquarium: string; component: string; message: string; style?: string }) => (
				`${notif.message}`
			  )
			);
			setToastMessage(
			  <div className='text-red'>
				{notificationMessages.map((message:string, index:string) => (
				  //<p key={index}>{message}</p>
				  <p key={index}  dangerouslySetInnerHTML={{ __html: message }} />
				))}
			  </div>
			);
		  }
		} catch (error) {
		  console.error("Error fetching notifications", error);
		}
	  };
	  

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
					<li key={index} className="flex items-center justify-center h-[50px] w-[150px]">
						<IonButton
							onClick={() => handleAquariumClick(aquarium)}
							onMouseEnter={() => setButtonState("hover")}
							onMouseLeave={() => setButtonState("")}
							className={`transition-colors duration-300 
								${buttonState === "hover" ? "bg-blue-200" : "bg-blue-100"} 
								hover:bg-gray-300 focus:bg-blue-300`}
						>
							{aquarium}
						</IonButton>
					</li>
					))}
				</ul>
			</div>
		  </div>
		  {toastMessage && <div className="toast ml-5">{toastMessage}</div>}
		</IonContent>
	  </IonPage>
	);
  };
export default Dashboard  
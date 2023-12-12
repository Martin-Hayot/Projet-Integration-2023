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
	IonModal
} from '@ionic/react';
import { Link,useHistory} from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { UserContext } from '../../components';
import requireAuth from "../../utils/requireAuth";
import { person } from 'ionicons/icons';
import Navbar from '../../components/Navbar';
import Cookies from 'js-cookie';

const DashboardPage: React.FC = () => {
	const { logout } = React.useContext(UserContext);
    async function localLogout() {
        logout();
        window.location.href = "/";
    }
    const [data, setData] = React.useState();
	const [showModal, setShowModal] = useState(false);
    const history = useHistory();
    const apiUrl = import.meta.env.VITE_URL_API;
	const [userInfo, setUserInfo] = useState<any | null>(null);
	const [aquariums, setAquariums] = useState<string[]>([]);
	const [buttonState, setButtonState] = useState<string>("");
	const [toastMessage, setToastMessage] = useState<React.ReactNode | null>(null);
	const [detailedComponent, setDetailedComponent] = useState<string | null>(null);
	const [selectedAquariumNotifications, setSelectedAquariumNotifications] = useState<any[]>([]);
	const onLoad = async () => {
	const userId = Cookies.get('userId');

	//const userId = requireUser.id
	
	  try {
		// Information utilisateur
		const userResponse = await axios.get(`${apiUrl}notification/user/${userId}`);
		setUserInfo(userResponse.data);
		  
		// Liste des aquariums
		const aquariumResponse = await axios.get(`${apiUrl}notification/aquarium/${userId}`);
		setAquariums(aquariumResponse.data);
	  } catch (error) {
		console.error("Error fetching data", error);
	  }
	};
  
	// Appel onLoad lorsque le composant est monté
	useEffect(() => {
		requireAuth(history);
		onLoad();
	}, []);

	async function getData() {
        axios
            .get(`${apiUrl}user`, {
                withCredentials: true,
            })
            .then((res) => {
                setData(res.data.message);
            })
            .catch((err) => {
                window.location.href = "/login";
            });
    }

	const handleAquariumClick = async (aquariumName: string) => {
		try {
		  const userId = localStorage.getItem('userId');
		  const notificationResponse = await axios.get(`${apiUrl}notification/notifications/${userId}`);
		  const notifications = notificationResponse.data.notifications;
		  
		  const selectedAquariumNotifications = notifications.filter(
			(notification: { aquarium: string; component: string; message: string; style?: string }) => notification.aquarium === aquariumName
		  );
	
		  setSelectedAquariumNotifications(selectedAquariumNotifications);
	
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
			const faultyComponents = aquariumNotifications.map(
				(notif: { aquarium: string; component: string; message: string; style?: string }) => notif.component
			  );
			  setToastMessage(
				<div className='text-red'>
				  {`Composant défaillant dans ${aquariumName}: ${faultyComponents.join(', ')}`}
				  <IonButton onClick={() => setShowModal(true)}>Voir détails</IonButton>
				</div>
			  );
		  }
		} catch (error) {
		  console.error("Error fetching notifications", error);
		}
	  };
	const handleCloseModal = () => {
    setShowModal(false);
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
      {/* Ajout du composant Modal pour afficher les détails */}
      <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Informations détaillées</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-text-center">
			{selectedAquariumNotifications.map(
				(notif: { aquarium: string; component: string; message: string; style?: string }, index: number) => (
            <div key={index} >
              <p className="ion-justify-content-center" dangerouslySetInnerHTML={{ __html: notif.message }} />
            </div>
          ))}
    	</IonContent>
        <IonFooter>
          <IonButton onClick={handleCloseModal}>Fermer</IonButton>
        </IonFooter>
      </IonModal>
		</IonContent>
	  </IonPage>
	);
  };
export default DashboardPage  
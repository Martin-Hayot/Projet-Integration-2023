import {
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonLabel,
	IonMenu,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonItem,
	IonInput,
	IonToast
} from '@ionic/react';
import axios from 'axios';
import React , { useState, useEffect } from 'react';
import { person } from 'ionicons/icons';

	const DashboardPage: React.FC = () => {
		async function logout() {
			window.location.href = '/';
		}

		const [newAquariumName, setNewAquariumName] = useState("");
		const [userInfo, setUserInfo] = useState<any | null>(null);
		const [aquariums, setAquariums] = useState<any[]>([]);
		const [data, setData] = React.useState();
		const [toastMessage, setToastMessage] = useState("");
		const [showSuccessToast, setShowSuccessToast] = useState(false);

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


	  // Fonction pour ajouter un nouvel aquarium
	const addNewAquarium = async () => {
		const userId = localStorage.getItem('userId');
		try {
		  	const response = await axios.post('http://localhost:3001/api/aquarium/', {
				userId: userId,
				name: newAquariumName,
			}, {withCredentials: true});
		  console.log(response.data);
		  setNewAquariumName("");
		  onLoad();
		} catch (error) {
		  console.error("Error adding new aquarium", error);
		}
	};

	async function getData() {
		axios
			.get('http://localhost:3001/api/user', {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data.message);
			})
			.catch((err) => {
				window.location.href = '/login';
			});
	}

	const deleteAquarium = async (aquariumId:string) => {
		try {
		const userId = localStorage.getItem('userId');

		const response = await axios.delete('http://localhost:3001/api/aquarium/delete', {
			data: {
				userId: userId,
				aquariumId: aquariumId,
			},
			withCredentials: true,
		});

		console.log(response.data.message); // Affichage du message de succès
		// Effectuer d'autres actions après la suppression réussie de l'aquarium
		setShowSuccessToast(true);
		setToastMessage("Probe deleted successfully");
		setTimeout(() => {
			window.location.reload();
			}, 2000);
		} 
		catch (error) {
			console.error("Error fetching data", error);
		}
	};
	  // Appelle onLoad lorsque le composant est monté
	useEffect(() => {
		onLoad();
	}, []);

	return (
		<>
			<IonMenu contentId='main-content'>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Menu Content</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className='ion-padding'>
					This is the menu content.
					<IonButton expand='block' onClick={logout}>
						Logout
					</IonButton>
				</IonContent>
			</IonMenu>
			<IonPage id='main-content'>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot='start'>
							<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonTitle></IonTitle>
						<div style= {{paddingTop: "25px", fontSize:"20px"}}>Menu</div>
							{userInfo && (
            					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
              						<IonIcon icon={person} />
              						<IonLabel>Bonjour {userInfo.firstname} {userInfo.lastname}</IonLabel>
            					</div>
          					)}
					</IonToolbar>
				</IonHeader>
				<IonContent className='ion-padding'>
					Tap the button in the toolbar to open the menu.
					<br />
					<IonButton onClick={getData}>Get Data</IonButton>
					<div>{data}</div>
					<IonItem>
						<IonLabel position='floating'>Ajouter un nouvel aquarium</IonLabel>
						<IonInput
							type='text'
							value={newAquariumName}
							onIonChange={(e) => setNewAquariumName(e.detail.value!)}
						></IonInput>
						<IonButton onClick={addNewAquarium}>Ajouter</IonButton>
					</IonItem>

					<br />
					<br />
					<p>Liste des aquariums :</p>
					{aquariums.map((aquarium, index) => (
					<IonCard key={index}>
						<IonCardHeader>
						<IonCardTitle>{aquarium.name}</IonCardTitle>
						</IonCardHeader>
						<IonCardContent>
						<IonButton
						type="submit"
						id="open-toast"
						className="ion-margin-top"
						onClick={() => deleteAquarium(aquarium._id)}>Supprimer</IonButton>
						<IonToast
								isOpen={showSuccessToast}
								onDidDismiss={() => setShowSuccessToast(false)}
								message="Probe deleted successfully"
								duration={3000}
								color="success"
								buttons={[
									{
										text: "Dismiss",
										role: "cancel",
									},
								]}
							/>
						<IonButton >À propos</IonButton>
						</IonCardContent>
					</IonCard>
					))}
				</IonContent>
			</IonPage>
		</>
	);
};

export default DashboardPage;

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
	IonToast,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { person } from 'ionicons/icons';
import { mail } from 'ionicons/icons';
import { home } from 'ionicons/icons';
import { ticket } from 'ionicons/icons';
import { UserContext } from '../../components';
import { barChart } from 'ionicons/icons';
import { personCircle } from 'ionicons/icons';
import Menu from '../../components/Menu';
import requireAuth from "../../utils/requireAuth";
import { useHistory } from "react-router-dom";

const apiUrl = import.meta.env.VITE_URL_API;

const DashboardPage: React.FC = () => {
	const { logout } = React.useContext(UserContext);
	async function localLogout() {
		logout();
		window.location.href = "/";
	}

	const [newAquariumName, setNewAquariumName] = useState("");
	const [userInfo, setUserInfo] = useState<any | null>(null);
	const [aquariums, setAquariums] = useState<any[]>([]);
	const [data, setData] = React.useState();
	const [toastMessage, setToastMessage] = useState("");
	const [showSuccessToast, setShowSuccessToast] = useState(false);


	useEffect(() => {
		requireAuth(history);

		axios.get(apiUrl + 'aquarium', {
			withCredentials: true,
		})
			.then((response) => {
				if (response.status === 401 || response.status === 400) {
					window.location.href = "/login?error=unauthorized";
					return;
				}
				setAquariums(response.data);
			});

		axios.get(apiUrl + 'user/profile',{
			withCredentials: true,
		})
			.then((response) => {
				if (response.status === 401 || response.status === 400) {
					window.location.href = "/login?error=unauthorized";
					return;
				}
				setUserInfo(response.data);
			})
	}, []);

	// Fonction pour ajouter un nouvel aquarium
	const addNewAquarium = async () => {
		const userId = localStorage.getItem('userId');
		try {
			const response = await axios.post(apiUrl + 'aquarium/', {
				userId: userId,
				name: newAquariumName,
			}, { withCredentials: true });
			setNewAquariumName("");
			setShowSuccessToast(true);
			setToastMessage("Probe created successfully");
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (error) {
			console.error("Error adding new aquarium", error);
		}
	};

	const redirectToCharts = (id: string) => {
		window.location.href = '/user/Charts?id=' + encodeURIComponent(id);
	}

	const deleteAquarium = async (aquariumId: string) => {
		try {
			const userId = localStorage.getItem('userId');

			const response = await axios.delete(apiUrl + 'aquarium/delete', {
				data: {
					userId: userId,
					aquariumId: aquariumId,
				},
				withCredentials: true,
			});

			// Effectuer d'autres actions après la suppression réussie de l'aquarium
			setShowSuccessToast(true);
			setToastMessage("Probe deleted successfully");
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		}
		catch (error) {
			console.error("Error fetching data", error);
		}
	};

	return (
		<>
			<Menu></Menu>
			<IonPage id='main-content'>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot='start'>
							<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonTitle></IonTitle>
						<div style={{ paddingTop: "25px", fontSize: "20px" }}>Menu</div>
						{userInfo && (
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
								<IonIcon icon={person} />
								<IonLabel>Bonjour {userInfo.firstname} {userInfo.lastname}</IonLabel>
							</div>
						)}
					</IonToolbar>
				</IonHeader>
				<IonContent className='ion-padding'>
					<br />
					<IonItem>
						<IonLabel position='floating'>Ajouter un nouvel aquarium</IonLabel>
						<IonInput
							type='text'
							value={newAquariumName}
							onIonChange={(e) => setNewAquariumName(e.detail.value!)}
						></IonInput>
						<IonButton onClick={addNewAquarium}>Ajouter</IonButton>
						<IonToast
							isOpen={showSuccessToast}
							onDidDismiss={() => setShowSuccessToast(false)}
							message="Probe created successfully"
							duration={3000}
							color="success"
							buttons={[
								{
									text: "Dismiss",
									role: "cancel",
								},
							]}
						/>
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
								<IonGrid>
									<IonRow class="ion-align-items-center">
										<IonButton
											style={{ height: '30px', width: '200px' }}
											type="submit"
											id="open-toast"
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
										<IonButton style={{ height: '30px', width: '200px' }}
											onClick={() => redirectToCharts(aquarium._id)}
										> voir les graphiques</IonButton>
									</IonRow>
								</IonGrid>
							</IonCardContent>
						</IonCard>
					))}
				</IonContent>
			</IonPage>
		</>
	);
};

export default DashboardPage;

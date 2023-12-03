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
	const { logout } = React.useContext(UserContext);
	async function localLogout() {
		logout();
		window.location.href = '/';
	}
	const [data, setData] = React.useState();

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
					<div>
						<Link to={'/contact'}>Contact</Link>
					</div>
					<IonButton expand='block' onClick={localLogout}>
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
						<IonTitle>Menu</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className='ion-padding'>
					Tap the button in the toolbar to open the menu.
					<br />
					<IonButton onClick={getData}>Get Data</IonButton>
					<div>{data}</div>
				</IonContent>
			</IonPage>
		</>
	);
};

export default DashboardPage;

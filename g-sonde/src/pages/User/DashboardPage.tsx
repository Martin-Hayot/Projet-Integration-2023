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
} from "@ionic/react";
import axios from "axios";
import React from "react";

const Home: React.FC = () => {
	async function logout() {
		window.location.href = "/";
	}
	const [data, setData] = React.useState();

	async function getData() {
		const response = await axios.get("http://127.0.0.1:3001/api/user");
		setData(response.data.message);
	}

	return (
		<>
			<IonMenu contentId="main-content">
				<IonHeader>
					<IonToolbar>
						<IonTitle>Menu Content</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-padding">
					This is the menu content.
					<IonButton expand="block" onClick={logout}>
						Logout
					</IonButton>
				</IonContent>
			</IonMenu>
			<IonPage id="main-content">
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonTitle>Menu</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-padding">
					Tap the button in the toolbar to open the menu.
					<br />
					<IonButton onClick={getData}>Get Data</IonButton>
					<div>{data}</div>
				</IonContent>
			</IonPage>
		</>
	);
};

export default Home;

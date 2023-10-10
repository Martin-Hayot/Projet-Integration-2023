import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React from "react";
import { logInOutline, personCircleOutline } from "ionicons/icons";

const Login: React.FC = () => {
	async function logIn() {
		alert("Login");
	}
	return (
		<IonPage>
			<div className="md:w-[35em] md:m-auto my-auto">
				<h1 className="text-2xl text-center mb-6">
					Login or Create a new account
				</h1>
				<IonCard className="">
					<IonCardContent>
						<form onSubmit={logIn}>
							<IonItem>
								<IonLabel position="floating">Email</IonLabel>
								<IonInput type="email" required></IonInput>
							</IonItem>
							<IonItem>
								<IonLabel position="floating">Password</IonLabel>
								<IonInput type="password" required></IonInput>
							</IonItem>
							<IonButton
								expand="block"
								type="submit"
								className="ion-margin-top"
							>
								Login
								<IonIcon icon={logInOutline} slot="end" className="mb-1" />
							</IonButton>
							<IonButton
								expand="block"
								type="button"
								color={"secondary"}
								routerLink="/register"
							>
								Create Account
								<IonIcon
									icon={personCircleOutline}
									className="mb-1 ml-1"
								></IonIcon>
							</IonButton>
							<div className="border my-6 border-gray-500"> </div>
							<IonButton expand="block" color={"tertiary"}>
								Google
							</IonButton>
						</form>
					</IonCardContent>
				</IonCard>
			</div>
		</IonPage>
	);
};

export default Login;

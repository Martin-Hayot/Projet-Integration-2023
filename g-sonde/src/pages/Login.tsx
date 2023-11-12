import {
	IonButton,
	IonCard,
	IonCardContent,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonPage,
	IonToast,
} from "@ionic/react";
import { Browser } from "@capacitor/browser";
import React, { useState } from "react";
import { logInOutline, personCircleOutline } from "ionicons/icons";
import axios from "axios";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [showErrorToast, setShowErrorToast] = useState(false);
	const [showSuccessToast, setShowSuccessToast] = useState(false);

	async function logIn(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		axios
			.post(
				"http://localhost:3001/api/auth/login",
				{
					email: email,
					password: password,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.status == 200) {
					setShowSuccessToast(true);
					setToastMessage("Logged in successfully");
					sleep(1000).then(() => {
						window.location.href = "/user/home";
					});
				} else {
					setShowErrorToast(true);
					setToastMessage(res.data.message);
				}
			})
			.catch((err) => {
				setShowErrorToast(true);
				setToastMessage(err.response.data.message);
			});
	}

	async function getGoogleOAuthUrl() {
		const res = await axios.get("http://localhost:3001/api/auth/google");
		return res.data.url as string;
	}

	const handleGoogleLogin = async () => {
		const url = await getGoogleOAuthUrl();
		await Browser.open({ url: url });
	};

	function sleep(ms: number | undefined) {
		return new Promise((resolve) => setTimeout(resolve, ms));
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
								<IonInput
									type="email"
									onIonChange={(e) => setEmail(e.detail.value!)}
									required
								></IonInput>
							</IonItem>
							<IonItem>
								<IonLabel position="floating">Password</IonLabel>
								<IonInput
									type="password"
									required
									onIonChange={(e) => setPassword(e.detail.value!)}
								></IonInput>
							</IonItem>
							<IonButton
								expand="block"
								type="submit"
								id="open-toast"
								className="ion-margin-top"
							>
								Login
								<IonIcon icon={logInOutline} slot="end" className="mb-1" />
							</IonButton>
							<IonToast
								isOpen={showErrorToast}
								onDidDismiss={() => setShowErrorToast(false)}
								color="danger"
								message={toastMessage}
								duration={3000}
								buttons={[
									{
										text: "Dismiss",
										role: "cancel",
									},
								]}
							/>
							<IonToast
								isOpen={showSuccessToast}
								onDidDismiss={() => setShowSuccessToast(false)}
								message="Login successful!"
								duration={3000}
								color="success"
								buttons={[
									{
										text: "Dismiss",
										role: "cancel",
									},
								]}
							/>
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
						</form>
						<IonButton
							expand="block"
							onClick={handleGoogleLogin}
							color={"tertiary"}
						>
							Google
						</IonButton>
					</IonCardContent>
				</IonCard>
			</div>
		</IonPage>
	);
};

export default Login;

import {
	IonButton,
	IonContent,
	IonFooter,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	isPlatform,
} from "@ionic/react";
import React from "react";
import { Router } from "react-router";
import { Link } from "react-router-dom";

const isDesktop = isPlatform("desktop");

const Home: React.FC = () => {
	return (
		<IonPage>
			{isDesktop ? (
				// Render desktop-specific content
				<div>
					<div className="flex justify-between">
						<div className="text-3xl m-6">
							<Link to="">G-Sonde</Link>
						</div>
						<nav className="flex justify-end items-center text-2xl m-6">
							<ul className="flex gap-12">
								<li className="">
									<Link to="/">Home</Link>
								</li>
								<li>
									<Link to="/about">About</Link>
								</li>
								<li>
									<Link to="/contact">Contact</Link>
								</li>
							</ul>

							<div className="mx-12">
								<IonButton className="mr-8" routerLink="/login">
									Log in
								</IonButton>
								<IonButton className="" routerLink="/signup">
									Sign up
								</IonButton>
							</div>
						</nav>
					</div>

					<section className="mx-auto text-center mt-60">
						<h1 className="text-5xl mt-32 mb-6">Desktop Home</h1>
						<p className="mb-12">This is desktop-specific content.</p>
						<IonButton routerLink="/user/home">
							Go to your aquarium page
						</IonButton>
					</section>
				</div>
			) : (
				// Render mobile-specific content
				<IonHeader>
					<IonToolbar>
						<IonTitle>Home</IonTitle>
					</IonToolbar>
				</IonHeader>
			)}
		</IonPage>
	);
};

export default Home;

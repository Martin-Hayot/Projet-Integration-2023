import {
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonMenu,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	isPlatform,
} from "@ionic/react";
import React from "react";
import { Router } from "react-router";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";



const isDesktop = isPlatform("desktop");

const Home: React.FC = () => {
	const history = useHistory();

	const handleLinkClick = (path: string) => {
		history.push(path);
		window.location.reload();
	  };

	return (
		<>
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

					<section className="bg-aquarium dark:bg-aquarium mx-auto text-center h-screen bg-cover bg-center bg-no-repeat relative">
						<h1 className="text-5xl pt-[8%] mb-6 text-white">Desktop Home</h1>
						<p className="mb-12 text-white">This is desktop-specific content.</p>
						<div className="absolute inset-0 bg-center dark:bg-black"></div>
						<div className="group relative m-0 flex w-full h-full w-[35vh] h-[30vh] max-w-[35vh] max-h-[30vh] rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto" onClick={() => history.push("/login")}>
							<div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
							<img src="sonde.png" className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110" alt="" />
							</div>
							<div className="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
							<h1 className="font-serif text-2xl font-bold text-white shadow-xl ">Your Probe</h1>
							</div>
						</div>
						
					</section>
					<footer className="bg-transparent fixed bottom-0 w-full sm:h-12 md:h-16 lg:h-20 xl:h-24 backdrop-blur-sm"> 
						<div className="footer-content flex justify-center items-center mt-4 text-xl font-serif">
    						G-Sonde, developed thanks to Valérie Ramakers
  						</div>
					</footer>
				</div>
			) : (
				// Render mobile-specific content
				<>
					<IonMenu contentId="main-content">
						<IonHeader>
							<IonToolbar>
								<IonTitle>Menu Content</IonTitle>
							</IonToolbar>
						</IonHeader>
						<IonContent className="ion-padding">
							This is the menu content.
							<IonButton expand="block" routerLink="/login">
								Login
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
					</IonPage>
				</>
			)}
		</>
	);
};

export default Home;

import {
	IonButton,
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	isPlatform,
} from '@ionic/react';
import React from 'react';
import { Navbar } from '../components';

const isDesktop = isPlatform('desktop');

const About: React.FC = () => {
	return (
		<IonPage>
			{isDesktop ? (
				// Render desktop-specific content
				<div>
					<Navbar />

					<section className='mx-auto text-center mt-60'>
						<h1 className='text-5xl mt-32 mb-6'>Desktop About</h1>
						<p className='mb-12'>This is desktop-specific content.</p>
						<IonButton routerLink='/user/home'>
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

export default About;

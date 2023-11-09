import {
	IonContent,
	IonPage,
	IonInput,
	IonTextarea,
	IonButton,
	IonText,
} from '@ionic/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactUs: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		window.location.href = `mailto:sam.f.lambert@gmail.com?subject=Contact Us&body=Name: ${name}%0D%0AMessage: ${message}`;
	};
	const handleMailClick = () => {
		window.location.href = 'mailto:sam.f.lambert@gmail.com?subject=Contact Us';
	};

	return (
		<IonPage>
			<div className='flex justify-between'>
				<div className='text-3xl m-6'>
					<Link to=''>G-Sonde</Link>
				</div>
				<nav className='flex justify-end items-center text-2xl m-6'>
					<ul className='flex gap-12'>
						<li className=''>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/about'>About</Link>
						</li>
						<li>
							<Link to='/contact'>Contact</Link>
						</li>
					</ul>
					<div className='mx-12'>
						<IonButton className='mr-8' routerLink='/login'>
							Log in
						</IonButton>
						<IonButton className='' routerLink='/signup'>
							Sign up
						</IonButton>
					</div>
				</nav>
			</div>
			<IonContent class='ion-padding ion-text-center'>
				<form
					onSubmit={handleSubmit}
					style={{ margin: '1% auto', width: '50%' }}>
					<IonInput
						value={name}
						fill='outline'
						labelPlacement='stacked'
						label='Name'
						clearInput={true}
						onIonChange={(e) => setName(e.detail.value!)}
						style={{ marginBottom: '1%' }}
						required></IonInput>
					<IonInput
						type='email'
						value={email}
						fill='outline'
						labelPlacement='stacked'
						label='Email'
						clearInput={true}
						onIonChange={(e) => setEmail(e.detail.value!)}
						style={{ marginBottom: '1%' }}
						required></IonInput>
					<IonTextarea
						value={message}
						fill='outline'
						label='Message'
						labelPlacement='stacked'
						onIonChange={(e) => setMessage(e.detail.value!)}
						autoGrow={true}
						style={{ marginBottom: '1%' }}
						required></IonTextarea>
					<IonButton type='submit'>Submit</IonButton>
				</form>
				<hr />
				<div style={{ margin: '1%' }}>
					<IonText color={'medium'}>
						<h1 style={{ fontSize: '1.5em' }}>
							Clicked here to send us a mail easily!
						</h1>
					</IonText>
					<IonButton onClick={handleMailClick}>Send Mail</IonButton>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default ContactUs;

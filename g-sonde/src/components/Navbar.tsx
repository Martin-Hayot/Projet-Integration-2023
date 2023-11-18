import { Link } from 'react-router-dom';
import { IonButton } from '@ionic/react';
const Navbar: React.FC = () => {
	return (
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
	);
};

export default Navbar;

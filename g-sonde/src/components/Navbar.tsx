import React from "react";
import { Link } from "react-router-dom";
import { IonButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { UserContext } from "../components";

const Navbar: React.FC = () => {
	const { emailUser, abilityUser, logout } = React.useContext(UserContext);
	return (
		<div className="flex justify-between">
			<IonReactRouter>
				<div className="text-3xl m-6">
					<Link to="">G-Sonde</Link>
				</div>
				<nav className="flex justify-end items-center text-2xl m-6">
					<ul className="flex gap-12">
						<li className="">
							<Link to="/" id="navbar-home">
								Home
							</Link>
						</li>
						<li>
							<Link to="/about" id="navbar-about">
								About
							</Link>
						</li>
						{emailUser && (
							<>
								<li>
									<Link to="/contact" id="navbar-contact">
										Contact
									</Link>
								</li>
								<li>
									<Link to="/user/dashboard" id="navbar-dashboard">
										Dashboard
									</Link>
								</li>
								<li>
									<Link to="/user/tickets" id="navbar-user-tickets">
										Tickets
									</Link>
								</li>
							</>
						)}
						{abilityUser === "1" && (
							<li>
								<Link to="/admin/tickets" id="navbar-admin-tickets">
									Admin Tickets
								</Link>
							</li>
						)}
					</ul>
					{!emailUser && (
						<div className="mx-12">
							<IonButton className="mr-8" id="navbar-login" routerLink="/login">
								Log in
							</IonButton>
							<IonButton className="" id="navbar-signup" routerLink="/signup">
								Sign up
							</IonButton>
						</div>
					)}
					{emailUser && (
						<div className="mx-12">
							<IonButton
								id="navbar-logout"
								className="mr-8"
								onClick={() => {
									logout();
									window.location.href = "/";
								}}>
								Logout
							</IonButton>
						</div>
					)}
				</nav>
			</IonReactRouter>
		</div>
	);
};

export default Navbar;

import { IonButton } from "@ionic/react";
import React, { useEffect, useRef } from "react";
import { UserContext } from "../components";

import "../../styles/navbar.css";

const Navbar: React.FC = () => {
	const { emailUser, abilityUser, logout } = React.useContext(UserContext);

	const menu: any = useRef(null);
	const menuBtn: any = useRef(null);
	const toggleMenu = () => {
		menu.current.classList.toggle("hidden");
		menu.current.classList.toggle("flex");
		menuBtn.current.classList.toggle("open");
	};

	useEffect(() => {
		menu.current = document.getElementById("menu");
		menuBtn.current = document.getElementById("menu-btn");
		menuBtn.current.addEventListener("click", toggleMenu);
		const popstateHandler = () => {
			menu.current.classList.toggle("hidden");
			menu.current.classList.toggle("flex");
			menuBtn.current.classList.toggle("open");
		};
		window.addEventListener("popstate", popstateHandler);

		return () => {
			menuBtn.current.removeEventListener("click", toggleMenu);
			window.removeEventListener("popstate", popstateHandler);
		};
	}, []);

	return (
		<div>
			<nav className="flex items-center text-2xl justify-between text-neutral-200 h-20 mx-10">
				<a
					href="/"
					className="hover:scale-110 z-30 text-3xl transition-all duration-200 hover:text-white">
					G-Sonde
				</a>
				<div className="hidden lg:flex h-10 space-x-10 lg:space-x-12 xl:space-x-16 lg:pr-6 xl:pr-12">
					<a
						href="/about"
						className="hover:scale-110 transition-all duration-200 hover:text-white">
						About
					</a>
					{emailUser && (
						<a href="/contact" className="hover:text-red-500">
							Contact
						</a>
					)}
					{emailUser && (
						<a href="/user/dashboard" className="hover:text-red-500">
							Dashboard
						</a>
					)}
					{emailUser && (
						<a href="/user/tickets" className="hover:text-red-500">
							Tickets
						</a>
					)}
					{abilityUser === "1" && (
						<a href="/admin/tickets" className="hover:text-red-500">
							Admin Tickets
						</a>
					)}
					{!emailUser && (
						<a href="/login" className="hover:text-red-500 mx-12">
							Login
						</a>
					)}
					{!emailUser && (
						<a href="/signup" className="hover:text-red-500 mx-12">
							Register
						</a>
					)}
					{emailUser && (
						<IonButton
							id="navbar-logout"
							className="mr-8"
							onClick={() => {
								logout();
								window.location.href = "/";
							}}>
							Logout
						</IonButton>
					)}
				</div>
				<div className="lg:hidden mt-2">
					<button
						className="z-40 block hamburger lg:hidden focus:outline-none"
						id="menu-btn"
						type="button">
						<span className="hamburger-top"></span>
						<span className="hamburger-middle"></span>
						<span className="hamburger-bottom"></span>
					</button>
				</div>
			</nav>
			<div
				id="menu"
				className="absolute z-20 hidden top-0 bottom-0 left-0 flex-col self-end w-full min-h-screen py-1 pt-40 pl-12 space-y-3 text-xl text-white uppercase bg-black">
				<a href="/" className="hover:text-red-500">
					Home
				</a>
				<a href="/about" className="hover:text-red-500">
					About
				</a>

				{emailUser && (
					<a href="/contact" className="hover:text-red-500">
						Contact
					</a>
				)}
				{emailUser && (
					<a href="/user/dashboard" className="hover:text-red-500">
						Dashboard
					</a>
				)}
				{emailUser && (
					<a href="/user/tickets" className="hover:text-red-500">
						Tickets
					</a>
				)}
				{abilityUser === "1" && (
					<a href="/admin/tickets" className="hover:text-red-500">
						Admin Tickets
					</a>
				)}

				{!emailUser && (
					<a href="/login" className="hover:text-red-500">
						Login
					</a>
				)}
				{!emailUser && (
					<a href="/signup" className="hover:text-red-500">
						Register
					</a>
				)}
				{emailUser && (
					<IonButton
						id="navbar-logout"
						className="mr-8"
						onClick={() => {
							logout();
							window.location.href = "/";
						}}>
						Logout
					</IonButton>
				)}
			</div>
		</div>
	);
};

export default Navbar;

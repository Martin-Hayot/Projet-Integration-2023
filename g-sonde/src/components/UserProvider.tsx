import React, { useState, useEffect, ReactNode } from "react";
import { UserContext } from "../components";
import { UserProviderProps } from "../types";
import axios from "axios";

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [emailUser, setEmailUser] = useState<string | null>(
		localStorage.getItem("emailUser") || null
	);
	const [abilityUser, setAbilityUser] = useState<string | null>(
		localStorage.getItem("abilityUser") || null
	);

	const apiUrl = import.meta.env.VITE_URL_API;

	// Get the data from localStorage
	useEffect(() => {
		const storedEmailUser = localStorage.getItem("emailUser");
		if (storedEmailUser) {
			setEmailUser(storedEmailUser);
		}
		const storedAbilityUser = localStorage.getItem("abilityUser");
		if (storedAbilityUser) {
			setAbilityUser(storedAbilityUser);
		}
	}, []);

	// Set the emailUser in localStorage
	useEffect(() => {
		if (emailUser) localStorage.setItem("emailUser", emailUser);
	}, [emailUser]);

	// Set the abilityUser in localStorage
	useEffect(() => {
		if (abilityUser) localStorage.setItem("abilityUser", abilityUser);
	}, [abilityUser]);

	// When the user logs out, remove the data from localStorage
	const logout = () => {
		setEmailUser(null);
		setAbilityUser(null);
		localStorage.removeItem("emailUser");
		localStorage.removeItem("abilityUser");
		axios.delete(`${apiUrl}auth/logout`, {
			withCredentials: true,
		});
	};

	return (
		<UserContext.Provider
			value={{
				emailUser,
				abilityUser,
				setEmailUser,
				setAbilityUser,
				logout,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;

import axios from "axios";

const requireAuth = (history: any) => {
	const apiUrl = import.meta.env.VITE_URL_API;
	axios
		.get(`${apiUrl}auth/me`, { withCredentials: true })
		.then((res) => {
			if (res.data.authenticated) {
				return;
			}
			history.push("/login");
		})
		.catch((err) => {
			console.log(err);
			history.push("/login");
		});
};

export default requireAuth;

import axios from "axios";

const requireAuth = (history: any) => {
    axios
        .get("http://localhost:3001/api/auth/me", { withCredentials: true })
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

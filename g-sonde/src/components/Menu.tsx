import { Link } from "react-router-dom";
import React from "react";
import { 
    IonButton,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonFooter
} from "@ionic/react";
import { mail } from 'ionicons/icons';
import { home } from 'ionicons/icons';
import { ticket } from 'ionicons/icons';
import { barChart } from 'ionicons/icons';
import { personCircle } from 'ionicons/icons';
import { listOutline } from 'ionicons/icons';
import { logOutOutline } from 'ionicons/icons';
import { UserContext } from "../components";

const Menu: React.FC = () => {
    const { logout } = React.useContext(UserContext);
    async function localLogout() {
        logout();
    window.location.href = "/";
    }

return (
    <IonMenu contentId='main-content'>
        <IonHeader>
            <IonToolbar>
                <IonTitle style={{ fontSize: "24px" }}>Menu</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
            <div style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Link style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    color: "gainsboro",
                    fontSize: "16px"
                }} to={'/'}
                onMouseOver={(e) => {
                    e.currentTarget.style.fontSize = "20px";
                    e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.fontSize = "16px";
                    e.currentTarget.style.color = "gainsboro";
                }}
                onClick={(e) => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }}
                ><IonIcon icon={home} size='large'/><div style={{marginRight:"5px", marginLeft:"25px"}}>Home</div></Link>
            </div>
            <div style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Link style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    color: "gainsboro",
                    fontSize: "16px"
                    }} to={'/contact'}
                    onMouseOver={(e) => {
                        e.currentTarget.style.fontSize = "20px";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.fontSize = "16px";
                        e.currentTarget.style.color = "gainsboro";
                    }}
                    ><IonIcon icon={mail} size='large'/><div style={{marginRight:"5px", marginLeft:"25px"}}>Contact </div></Link>
            </div>
            <div style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Link style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    color: "gainsboro",
                    fontSize: "16px"
                    }} to={'/user/tickets'}
                    onMouseOver={(e) => {
                        e.currentTarget.style.fontSize = "20px";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.fontSize = "16px";
                        e.currentTarget.style.color = "gainsboro";
                    }}
                    ><IonIcon icon={ticket} size='large'/><div style={{marginRight:"5px", marginLeft:"25px"}}>Tickets </div></Link>
            </div>
            <div style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Link style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    color: "gainsboro",
                    fontSize: "16px"
                    }} to={'/user/Charts'}
                    onMouseOver={(e) => {
                        e.currentTarget.style.fontSize = "20px";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.fontSize = "16px";
                        e.currentTarget.style.color = "gainsboro";
                    }}
                    ><IonIcon icon={barChart} size='large'/><div style={{marginRight:"5px", marginLeft:"25px"}}>Charts </div></Link>
            </div>
            <div style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Link style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    color: "gainsboro",
                    fontSize: "16px"
                    }} to={'/user/profile'}
                    onMouseOver={(e) => {
                        e.currentTarget.style.fontSize = "20px";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.fontSize = "16px";
                        e.currentTarget.style.color = "gainsboro";
                    }}
                    ><IonIcon icon={personCircle} size='large'/><div style={{marginRight:"5px", marginLeft:"25px"}}>Profile </div></Link>
            </div>
            <div style={{paddingTop:"15px", paddingBottom:"15px"}}>
                <Link style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "5px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    color: "gainsboro",
                    fontSize: "16px"
                    }} to={'/user/dashboard'}
                    onMouseOver={(e) => {
                        e.currentTarget.style.fontSize = "20px";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.fontSize = "16px";
                        e.currentTarget.style.color = "gainsboro";
                    }}
                    ><IonIcon icon={listOutline} size='large'/><div style={{marginRight:"5px", marginLeft:"25px"}}>Dashboard </div></Link>
            </div>
        </IonContent>
        <IonFooter className="ion-fixed-bottom">
            <div style={{marginBottom:"15px", marginLeft:"10px", marginRight:"10px"}}>
                <IonButton expand='block' onClick={localLogout}>
                    <IonIcon icon={logOutOutline} size='large' style={{marginRight:'10px'}}></IonIcon> <div style={{marginTop:"3px"}}>Logout</div>
                </IonButton>
            </div>
        </IonFooter>
    </IonMenu>
)
};

export default Menu;
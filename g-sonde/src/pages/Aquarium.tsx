import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const isDesktop = isPlatform("desktop");

const Aquarium: React.FC = () => {
  const [data, setData] = useState();
  useEffect(() => {
    axios.get('https://g-sonde.gay:3000/getDataAquarium')
      .then((response) => {
        setData(response.data);
        console.log(data);
      })
  }, []);
  return (
    <IonPage>
      {data && (
        <ul>
          {(data as Array<{ _id: number, data: number }>).map(item => (
            <li key={item._id}>{item.data}</li>
          ))}
        </ul>
      )}
    </IonPage>
  );
};

export default Aquarium;

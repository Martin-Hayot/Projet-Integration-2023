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

const api_link = 'http://127.0.0.1:3001';

const Aquarium: React.FC = () => {
  const [data, setData] = useState();
  useEffect(() => {
    axios.get(api_link + '/aquarium/data')
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

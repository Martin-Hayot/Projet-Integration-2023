import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

import { useEffect, useState } from "react";
import axios from "axios";

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  const [data, setData] = useState();
  useEffect(() => {
    axios.get('http://51.68.172.36:3000/getDataAquarium')
      .then((response) => {
        setData(response.data);
        console.log(data);
      })
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonContent>
          {data && (
            <ul>
              {(data as Array<{ _id: number, data: number }>).map(item => (
                <li key={item._id}>{item.data}</li>
              ))}
            </ul>
          )}

        </IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;

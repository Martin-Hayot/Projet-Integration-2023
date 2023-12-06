import {
	IonContent,
	IonSelect,
	IonSelectOption,
	IonItem,
	IonList,
	IonPage,
	IonText,
} from "@ionic/react";

import React from "react";
import { useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import axios from "axios";
import { Navbar, LineChart } from "../../components";
import requireAuth from "../../utils/requireAuth";
import { useHistory } from "react-router-dom";
const apiUrl = import.meta.env.VITE_URL_API;

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

let chartTitle = "Raw data";
let xTitle = "Frequency";
let yTitle = "Resistance";

const Charts: React.FC = () => {
	const displayedIdsAquarium: string[] = [];
	const displayedIdsDiagnostic: string[] = [];
	const [aquariumId, setAquariumId] = useState<String>("-1");

	const [dataAquarium, setDataAquarium] = useState<any[]>([]);
	const [dataDiagnostic, setDataDiagnostic] = useState<any[]>([]);
	const [dataGraph, setDataGraph] = useState<any[]>([]);

	const history = useHistory();

	useEffect(() => {
		requireAuth(history);
		axios
			.get(apiUrl + "aquarium", {
				withCredentials: true,
			})
			.then((response) => {
				if (response.status === 401 || response.status === 400) {
					window.location.href = "/login?error=unauthorized";
					return;
				}
				setDataAquarium(response.data);
			});
	}, []);

	const aquariumDiagnostic = (aquarium: string) => {
		setDataGraph([]);
		setAquariumId(aquarium);
		axios
			.get(apiUrl + "aquarium/" + aquarium + "/diagnostic", {
				withCredentials: true,
			})
			.then((response) => {
				if (response.status === 401 || response.status === 400) {
					window.location.href = "/login?error=unauthorized";
					return;
				}
				setDataDiagnostic(response.data);
			})
			.catch((error) => {
				console.error("Error fetching aquarium:", error);
			});
	};

	const diagnosticData = (diagnostic: string) => {
		axios
			.get(
				apiUrl +
					"aquarium/" +
					aquariumId +
					"/diagnostic/" +
					diagnostic +
					"/data",
				{ withCredentials: true }
			)
			.then((response) => {
				if (response.status === 401 || response.status === 400) {
					window.location.href = "/login?error=unauthorized";
					return;
				}
				setDataGraph(response.data);
			})
			.catch((error) => {
				console.error("Error fetching aquarium:", error);
			});
	};

	const chartData = {
		labels: dataGraph.map((item) => item.frequency),
		datasets: [
			{
				label: "Resistance / Frequency",
				data: dataGraph.map((item) => item.measure),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};

	return (
		<IonPage>
			<Navbar />
			<IonList>
				<IonItem>
					<IonSelect
						placeholder="Selectionner un aquarium"
						onIonChange={(e) => aquariumDiagnostic(e.detail.value)}>
						<div slot="label">
							auquarium <IonText color="danger">(Requis)</IonText>
						</div>
						{dataAquarium
							.filter((item) => {
								if (displayedIdsAquarium.includes(item._id)) {
									return false;
								} else {
									displayedIdsAquarium.push(item._id);
									return true;
								}
							})
							.map((item) => (
								<IonSelectOption key={item._id} value={item._id}>
									{item.name}
								</IonSelectOption>
							))}
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonSelect
						placeholder="Selectionner un diagnostique"
						onIonChange={(e) => diagnosticData(e.detail.value)}>
						<div slot="label">
							diagnostic <IonText color="danger">(Requis)</IonText>
						</div>
						{dataDiagnostic
							.filter((item) => {
								if (displayedIdsDiagnostic.includes(item._id)) {
									return false;
								} else {
									displayedIdsDiagnostic.push(item._id);
									return true;
								}
							})
							.map((item) => (
								<IonSelectOption key={item._id} value={item._id}>
									{item.date.slice(0, 10)}
								</IonSelectOption>
							))}
					</IonSelect>
				</IonItem>
			</IonList>
			<IonContent class="ion-padding">
				<LineChart
					title={chartTitle}
					xTitle={xTitle}
					yTitle={yTitle}
					data={chartData}
				/>
			</IonContent>
		</IonPage>
	);
};

export default Charts;

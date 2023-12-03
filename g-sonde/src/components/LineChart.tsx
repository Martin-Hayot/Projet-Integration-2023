import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


function LineChart(props: any) {

    const options = {
        responsive: true,
        layout: {
            padding: {
                right: 50,
                bottom: 20
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: props.title,
            },

        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: props.xTitle
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: props.yTitle
                },
            },
        }
    };

    return (

        <Line options={options} data={props.data} />
    );
};

export default LineChart;
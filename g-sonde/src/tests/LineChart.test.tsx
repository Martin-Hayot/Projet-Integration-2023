import { render } from "@testing-library/react";
import LineChart from '../components/LineChart';

const chartData = {
    labels: [1, 2],
    datasets: [
        {
            label: 'Resistance / Frequency',
            data: [2, 1],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

test("renders without crashing", () => {
    const { baseElement } = render(
        <LineChart
            title="test"
            xTitle="xTitle"
            yTitle="yTitle"
            data={chartData}
        />
    );
    expect(baseElement).toBeDefined();
});
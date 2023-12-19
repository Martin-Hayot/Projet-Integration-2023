import { render } from "@testing-library/react";
import { DashboardPage } from "../../pages";

test("renders without crashing", () => {
    const { baseElement } = render(<DashboardPage/>);
    expect(baseElement).toBeDefined();
});

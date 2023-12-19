import { render } from "@testing-library/react";
import { TicketsViewer } from "../../pages";

test("renders without crashing", () => {
    const { baseElement } = render(<TicketsViewer />);
    expect(baseElement).toBeDefined();
});

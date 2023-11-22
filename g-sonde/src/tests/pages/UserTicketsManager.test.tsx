import { render } from "@testing-library/react";
import { UserTicketsManager } from "../../pages";

test("renders without crashing", () => {
	const { baseElement } = render(<UserTicketsManager />);
	expect(baseElement).toBeDefined();
});

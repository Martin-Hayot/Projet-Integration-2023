import { render } from "@testing-library/react";
import { ContactUs } from "../../pages";

test("renders without crashing", () => {
	const { baseElement } = render(<ContactUs />);
	expect(baseElement).toBeDefined();
});

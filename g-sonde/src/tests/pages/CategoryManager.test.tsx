import { render } from "@testing-library/react";
import { CategoryManager } from "../../pages";

test("renders without crashing", () => {
	const { baseElement } = render(<CategoryManager />);
	expect(baseElement).toBeDefined();
});

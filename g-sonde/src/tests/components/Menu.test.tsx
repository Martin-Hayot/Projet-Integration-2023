import { render } from "@testing-library/react";
import Menu from "../../components/Menu";

test("renders without crashing", () => {
	const { baseElement } = render(
        <Menu></Menu>
	);
	expect(baseElement).toBeDefined();
});

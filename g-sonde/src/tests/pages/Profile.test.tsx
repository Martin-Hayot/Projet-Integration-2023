import { render } from "@testing-library/react";
import { Profile } from "../../pages";

test("renders without crashing", () => {
    const { baseElement } = render(<Profile />);
    expect(baseElement).toBeDefined();
});

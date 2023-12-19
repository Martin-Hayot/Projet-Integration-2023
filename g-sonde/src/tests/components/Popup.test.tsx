import { render } from "@testing-library/react";
import { Popup } from "../../components";
import App from "../../App";

test("renders without crashing", () => {
    const { baseElement } = render(
        <Popup isOpen={true} onClose={() => {}}>
            <App />
        </Popup>
    );
    expect(baseElement).toBeDefined();
});

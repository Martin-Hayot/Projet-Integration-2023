import { render } from "@testing-library/react";
import { UserProvider } from "../../components";
import App from "../../App";

test("renders without crashing", () => {
    const { baseElement } = render(
        <UserProvider>
            <App />
        </UserProvider>
    );
    expect(baseElement).toBeDefined();
});

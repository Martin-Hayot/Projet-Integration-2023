import { render } from "@testing-library/react";
import Menu from "../../components/Menu";
import { IonReactRouter } from "@ionic/react-router";

test("renders without crashing", () => {
    const { baseElement } = render(
        <IonReactRouter>
            <Menu></Menu>
        </IonReactRouter>
    );
    expect(baseElement).toBeDefined();
});

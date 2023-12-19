import { render } from "@testing-library/react";
import { ContactUs } from "../../pages";
import { IonReactRouter } from "@ionic/react-router";

test("renders without crashing", () => {
    const { baseElement } = render(
        <IonReactRouter>
            <ContactUs />
        </IonReactRouter>
    );
    expect(baseElement).toBeDefined();
});

import { render } from "@testing-library/react";
import { CategoryCard } from "../../components";

test("renders without crashing", () => {
    const { baseElement } = render(
        <CategoryCard _id="test" label="test" onDelete={() => []} />
    );
    expect(baseElement).toBeDefined();
});

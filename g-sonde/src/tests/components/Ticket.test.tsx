import { render } from "@testing-library/react";
import { Ticket } from "../../components";

test("renders without crashing", () => {
    const { baseElement } = render(
        <Ticket
            categoryId="test"
            onArchive={() => {}}
            archived={false}
            message="test"
            _id="test"
            onDelete={() => {}}
        />
    );
    expect(baseElement).toBeDefined();
});

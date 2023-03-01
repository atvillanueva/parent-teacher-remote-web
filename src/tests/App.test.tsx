import { render, screen, waitFor } from "@/test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import moment from "moment";

import App from "@/App";

beforeEach(() => {
  render(<App />);
});

describe("App component", async () => {
  it("should display the form with following fields: home rome, student number, pictures and submit button", async () => {
    expect(screen.getByLabelText(/home room/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/home room/i)).toHaveValue("");
    expect(screen.getByLabelText(/student number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/student number/i)).toHaveValue("");

    await waitFor(() => expect(screen.getAllByTestId("nouns")).toHaveLength(3));

    expect(screen.getByRole("button", { name: /apple/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apple/i })).toHaveValue("Apple");
    expect(
      screen.getByRole("button", { name: /apple/i, pressed: false })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /orange/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /orange/i })).toHaveValue(
      "Orange"
    );
    expect(
      screen.getByRole("button", { name: /orange/i, pressed: false })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grapes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grapes/i })).toHaveValue(
      "Grapes"
    );
    expect(
      screen.getByRole("button", { name: /grapes/i, pressed: false })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
  });

  it("should display required message when user leaves empty fields and clicks the submit button", async () => {
    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/please enter your home room name/i)
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        screen.getByText(/please enter your student number/i)
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        screen.getByText(/please choose atleast 2 pictures/i)
      ).toBeInTheDocument()
    );
  });

  it("should not display required message and redirect home page when user fills the fields and clicks the submit button", async () => {
    const credentials = {
      homeRoomName: "ABCDE",
      studentNumber: "A001",
      nouns: "Apple, Orange",
    };

    userEvent.type(
      screen.getByLabelText(/home room/i),
      credentials.homeRoomName
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/home room/i)).toHaveValue(
        credentials.homeRoomName
      )
    );

    expect(
      screen.queryByText(/please enter your home room name/i)
    ).not.toBeInTheDocument();

    userEvent.type(
      screen.getByLabelText(/student number/i),
      credentials.studentNumber
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/student number/i)).toHaveValue(
        credentials.studentNumber
      )
    );

    expect(
      screen.queryByText(/please enter your student number/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /apple/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[0])
    );

    userEvent.click(screen.getByRole("button", { name: /orange/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /orange/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[1])
    );

    expect(
      screen.queryByText(/please choose atleast 2 pictures/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
    );

    expect(
      screen.getByText(
        new RegExp(`hello student ${credentials.studentNumber}`, "i")
      )
    ).toBeInTheDocument();
  });

  it("should display error message when home room name is invalid and clicks the submit button", async () => {
    const credentials = {
      homeRoomName: "INVALID",
      studentNumber: "A001",
      nouns: "Apple, Orange",
    };

    userEvent.type(
      screen.getByLabelText(/home room/i),
      credentials.homeRoomName
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/home room/i)).toHaveValue(
        credentials.homeRoomName
      )
    );

    expect(
      screen.queryByText(/please enter your home room name/i)
    ).not.toBeInTheDocument();

    userEvent.type(
      screen.getByLabelText(/student number/i),
      credentials.studentNumber
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/student number/i)).toHaveValue(
        credentials.studentNumber
      )
    );

    expect(
      screen.queryByText(/please enter your student number/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /apple/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[0])
    );

    userEvent.click(screen.getByRole("button", { name: /orange/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /orange/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[1])
    );

    expect(
      screen.queryByText(/please choose atleast 2 pictures/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /invalid home room name/i
    );
  });

  it("should display error message when student number is invalid and clicks the submit button", async () => {
    const credentials = {
      homeRoomName: "ABCDE",
      studentNumber: "INVALID",
      nouns: "Apple, Orange",
    };

    userEvent.type(
      screen.getByLabelText(/home room/i),
      credentials.homeRoomName
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/home room/i)).toHaveValue(
        credentials.homeRoomName
      )
    );

    expect(
      screen.queryByText(/please enter your home room name/i)
    ).not.toBeInTheDocument();

    userEvent.type(
      screen.getByLabelText(/student number/i),
      credentials.studentNumber
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/student number/i)).toHaveValue(
        credentials.studentNumber
      )
    );

    expect(
      screen.queryByText(/please enter your student number/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /apple/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[0])
    );

    userEvent.click(screen.getByRole("button", { name: /orange/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /orange/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[1])
    );

    expect(
      screen.queryByText(/please choose atleast 2 pictures/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /invalid student number/i
    );
  });

  it("should display error message when chosen pictures are invalid and clicks the submit button", async () => {
    const credentials = {
      homeRoomName: "ABCDE",
      studentNumber: "A001",
      nouns: "Apple, Grapes",
    };

    userEvent.type(
      screen.getByLabelText(/home room/i),
      credentials.homeRoomName
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/home room/i)).toHaveValue(
        credentials.homeRoomName
      )
    );

    expect(
      screen.queryByText(/please enter your home room name/i)
    ).not.toBeInTheDocument();

    userEvent.type(
      screen.getByLabelText(/student number/i),
      credentials.studentNumber
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/student number/i)).toHaveValue(
        credentials.studentNumber
      )
    );

    expect(
      screen.queryByText(/please enter your student number/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /apple/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[0])
    );

    userEvent.click(screen.getByRole("button", { name: /grapes/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /grapes/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[1])
    );

    expect(
      screen.queryByText(/please choose atleast 2 pictures/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /incorrect associated pictures/i
    );
  });

  it("should display error message when sign-in attempt 10 minutes before start time and clicks the submit button", async () => {
    process.env.TEST_CONFERENCE_START_DATE_TIME = moment(
      moment().subtract(10, "minutes")
    ).format("YYYY-MM-DD HH:mm:ss");

    const credentials = {
      homeRoomName: "ABCDE",
      studentNumber: "A001",
      nouns: "Apple, Orange",
    };

    userEvent.type(
      screen.getByLabelText(/home room/i),
      credentials.homeRoomName
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/home room/i)).toHaveValue(
        credentials.homeRoomName
      )
    );

    expect(
      screen.queryByText(/please enter your home room name/i)
    ).not.toBeInTheDocument();

    userEvent.type(
      screen.getByLabelText(/student number/i),
      credentials.studentNumber
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/student number/i)).toHaveValue(
        credentials.studentNumber
      )
    );

    expect(
      screen.queryByText(/please enter your student number/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /apple/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[0])
    );

    userEvent.click(screen.getByRole("button", { name: /orange/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /orange/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[1])
    );

    expect(
      screen.queryByText(/please choose atleast 2 pictures/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /sign-in attempt 10 minutes before start time/i
    );
  });

  it("should display error message when sign-in attempt 10 minutes before start time and clicks the submit button", async () => {
    process.env.TEST_CONFERENCE_START_DATE_TIME = moment(
      moment().add(5, "minutes")
    ).format("YYYY-MM-DD HH:mm:ss");

    const credentials = {
      homeRoomName: "ABCDE",
      studentNumber: "A001",
      nouns: "Apple, Orange",
    };

    userEvent.type(
      screen.getByLabelText(/home room/i),
      credentials.homeRoomName
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/home room/i)).toHaveValue(
        credentials.homeRoomName
      )
    );

    expect(
      screen.queryByText(/please enter your home room name/i)
    ).not.toBeInTheDocument();

    userEvent.type(
      screen.getByLabelText(/student number/i),
      credentials.studentNumber
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/student number/i)).toHaveValue(
        credentials.studentNumber
      )
    );

    expect(
      screen.queryByText(/please enter your student number/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /apple/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /apple/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[0])
    );

    userEvent.click(screen.getByRole("button", { name: /orange/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /orange/i, pressed: true })
      ).toHaveValue(credentials.nouns.split(", ")[1])
    );

    expect(
      screen.queryByText(/please choose atleast 2 pictures/i)
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled()
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /sign-in attempt 5 minutes after the start time/i
    );
  });
});

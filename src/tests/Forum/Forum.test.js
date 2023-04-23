// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import Forum from "../../components/Forum/Forum";
// import ForumPost from "../../components/Forum/ForumPost";

// describe("Forum component", () => {
//   test("displays forum posts", async () => {
//     const mockPost = {
//       postID: "1",
//       postDate: new Date(),
//       userID: "123",
//       description: "This is a test post",
//       interest: "Testing",
//       imageURL: "",
//       ratings: new Map(),
//       calculateRating: jest.fn(),
//     };
//     const mockGetDocs = jest.fn(() => ({
//       docs: [
//         {
//           id: mockPost.postID,
//           data: () => ({
//             postDate: mockPost.postDate,
//             userID: mockPost.userID,
//             description: mockPost.description,
//             interest: mockPost.interest,
//             imageURL: mockPost.imageURL,
//             ratings: {},
//           }),
//         },
//       ],
//     }));
//     const mockGetCountFromServer = jest.fn(() => ({
//       data: () => ({
//         count: 1,
//       }),
//     }));
//     jest.mock("../../firebase/config", () => ({
//       db: {},
//     }));
//     jest.mock("firebase/firestore", () => ({
//       collection: jest.fn(),
//       getCountFromServer: jest.fn(),
//       getDocs: jest.fn(),
//       limit: jest.fn(),
//       orderBy: jest.fn(),
//       query: jest.fn(),
//       where: jest.fn(),
//       DocumentData: {},
//       Query: {},
//     }));
//     jest.mock("../../data/Post", () => jest.fn(() => mockPost));
//     render(<Forum />);
//     // expect(screen.getByText("Loading Forum...")).toBeInTheDocument();
//     // await waitFor(() => expect(mockGetCountFromServer).toHaveBeenCalled());
//     // await waitFor(() => expect(mockGetDocs).toHaveBeenCalled());
//     // expect(screen.getByText(mockPost.description)).toBeInTheDocument();
//     expect(screen.getByText("")).toBeInTheDocument();
//   });
// });

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Forum from "../../components/Forum/Forum";

describe("Forum", () => {
  test("renders a loading message when posts are being fetched", async () => {
    render(<Forum />);
    expect(screen.getByText("Loading Forum...")).toBeInTheDocument();
  });

  test("renders the correct number of posts", async () => {
    render(<Forum />);
    await screen.findByTestId("post-container");
    const postElements = screen.getAllByTestId("post");
    expect(postElements.length).toBeGreaterThan(0);
  });

  test("loads more posts when 'Load more...' button is clicked", async () => {
    render(<Forum />);
    await screen.findByTestId("post-container");
    const initialPostElements = screen.getAllByTestId("post");
    const loadMoreButton = screen.getByText("Load more...");
    userEvent.click(loadMoreButton);
    const updatedPostElements = screen.getAllByTestId("post");
    expect(updatedPostElements.length).toBeGreaterThan(
      initialPostElements.length
    );
  });
});

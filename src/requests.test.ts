import { comments } from "./requests"
import { GitHubInterface } from "./github"

describe("requests", () => {
  describe("comments", () => {
    it("should send the correct request", async () => {
      const initialResponse = {}
      const GithubMock = jest.fn<GitHubInterface>(() => ({
        request: jest.fn().mockReturnValue(initialResponse),
        requestUrl: jest.fn(),
        paginate: jest.fn(),
      }))
      const github = new GithubMock()
      await comments("owner", "repo", 33, github)
      expect(github.request).toHaveBeenCalledWith("repos/owner/repo/issues/33/comments", "GET")
      expect(github.paginate).toHaveBeenCalledWith(initialResponse, [])
    })
  })
})

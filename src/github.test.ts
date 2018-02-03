import { GitHubInterface, GitHub } from "./github"
import fetch, { RequestInit, Response } from "node-fetch"

describe("GitHub", () => {
  describe("requestUrl", () => {
    it("should send the right request", () => {
      const fetchMock = jest.fn()
      const github = GitHub("token", fetchMock)
      github.requestUrl("https://myurl.com", "GET")
      expect(fetchMock).toHaveBeenCalledWith("https://myurl.com", {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.squirrel-girl-preview+json",
          Authorization: "token token",
        },
      })
    })
  })
  describe("request", () => {
    it("should send the right request", () => {
      const fetchMock = jest.fn()
      const github = GitHub("token", fetchMock)
      github.request("my/path", "GET")
      expect(fetchMock).toHaveBeenCalledWith("https://api.github.com/my/path", {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.squirrel-girl-preview+json",
          Authorization: "token token",
        },
      })
    })
  })
  describe("paginate", () => {
    it("should paginate properly", async () => {
      const fetchMock = jest.fn()
      const github = GitHub("token", fetchMock)
      const response = (next: string, response: any) => {
        const ResponseMock = jest.fn<Response>(() => ({
          json: jest.fn().mockReturnValue(Promise.resolve(response)),
          headers: {
            Link: next != null ? `<${next}>; rel="next"` : null,
          },
        }))
        return new ResponseMock()
      }
      const firstResponse = response("https://api.github.com/search/code?q=addClass+user%3Amozilla&page=2", ["a"])
      const secondResponse = response(null, ["b"])
      fetchMock.mockReturnValue(secondResponse)
      const output = await github.paginate(firstResponse, [])
      expect(output).toEqual(["a", "b"])
    })
  })
})

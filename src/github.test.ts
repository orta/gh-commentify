import appRunner, { commentsHandler, RequestHandler, GitHubGetFunction } from "./github"
import { Express, Request, Response } from "express"

describe("app runner", () => {

  let appMock: Express
  let handlerMock: RequestHandler

  beforeEach(() => {
    const AppMock = jest.fn<Express>(() => ({
      set: jest.fn(),
      get: jest.fn(),
      listen: jest.fn()
    }))
    appMock = new AppMock()
    const HandlerMock = jest.fn<RequestHandler>()
    handlerMock = new HandlerMock()
  })

  it("should set the right port", () => {
    appRunner(3000, appMock, handlerMock)
    expect(appMock.set).toHaveBeenCalledWith("port", 3000)
  })

  it("should register the GitHub handler", () => {
    appRunner(3000, appMock, handlerMock)
    expect(appMock.get).toHaveBeenCalledWith("/repos/:owner/:repo/issues/:number/comments", expect.anything())
  })

})

describe("commentsHandler", () => {

  let githubGet: GitHubGetFunction
  let request: Request
  let response: Response

  beforeEach(() => {
    githubGet = jest.fn<GitHubGetFunction>().mockReturnValue(Promise.resolve({
      json: () => Promise.resolve([]),
      status: 200
    }))
    const Response = jest.fn<Response>(() => ({
      status: jest.fn(),
      header: jest.fn(),
      json: jest.fn()
    }))
    response = new Response
  })

  describe("when the owner doesn't match", () => {
    beforeEach(() => {
      const Request = jest.fn<Request>(() => ({
        params: {
          owner: "owner_a"
        }
      }))
      request = new Request
      commentsHandler(githubGet, "owner_b", "token")(request, response)
    })
    it("should return a 401", () => {
      expect(response.status).toHaveBeenCalledWith(401)
    })
    it("should return the correct object", () => {
      expect(response.json).toHaveBeenCalledWith({
        message: "Only can get comments with owner: owner_b"
      })
    })
  })

  describe("when the owner matches", () => {
    beforeEach(() => {
      const Request = jest.fn<Request>(() => ({
        params: {
          owner: "owner_a",
          repo: "repo",
          number: "33"
        }
      }))
      request = new Request
      commentsHandler(githubGet, "owner_a", "token")(request, response)
    })
    describe("GitHub request", () => {
      it("should have the correct path", () => {
        expect(githubGet).toHaveBeenCalledWith("repos/owner_a/repo/issues/33/comments", expect.anything())
      })
      it("should have been called with the right request", () => {
        expect(githubGet).toHaveBeenCalledWith(expect.anything(), {
          method: "GET", headers: {
            Accept: "application/vnd.github.squirrel-girl-preview+json",
            Authorization: "token token"
          }
        })
      })
    })

  })

})
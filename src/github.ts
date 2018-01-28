// @ts-check
import * as express from "express"
import fetch, { RequestInit, Response } from "node-fetch"

export interface GitHubGetFunction {
  (path: string, request: RequestInit): Promise<Response>;
}

export interface RequestHandler {
  (req: express.Request, res: Express.Response): void;
}

const githubGet: GitHubGetFunction = (path, request) => {
  const ghUrl = "https://api.github.com"
  return fetch([ghUrl, path].join("/"), request)
}

export const commentsHandler = (githubGet: GitHubGetFunction, owner?: string, githubToken?: string) => (req: express.Request, res: express.Response) => {
  if (req.params.owner !== owner) {
    res.status(401)
    res.json({ message: "Only can get comments with owner: " + owner })
    return
  }
  const requestParams = {
    method: "GET", headers: {
      Accept: "application/vnd.github.squirrel-girl-preview+json",
      Authorization: "token " + githubToken,
    }
  }
  interface HTTPResponse<T> {
    object: T,
    status: number
  }
  interface Comment {
    id: string
  }
  const sendRequest = (path: string): Promise<HTTPResponse<any>> => {
    return githubGet(path, requestParams).then(response => {
      return Promise.all([Promise.resolve(response.status), response.json()])
    }).then(response => {
      return Promise.resolve({ status: response[0], object: response[1] })
    })
  }
  const comments = (): Promise<HTTPResponse<Comment[]>> => {
    const issueCommentsPath = ["repos", req.params.owner, req.params.repo, "issues", req.params.number, "comments"].join("/")
    return sendRequest(issueCommentsPath)
  }
  const reactions = (comments: string[]): Promise<object> => {
    return Promise.all(comments.map((commentId) => {
      const reactionsPath = ["repos", req.params.owner, req.params.repo, "issues", "comments", commentId, "reactions"].join("/")
      const reactionsPromise = sendRequest(reactionsPath)
      return Promise.all([Promise.resolve(commentId), reactionsPromise]).then((arr) => {
        return Promise.resolve({ commentId: arr[0], reactions: arr[1] })
      })
    })).then((commentsReactions) => {
      var result = commentsReactions.reduce(function (map, obj) {
        map[obj.commentId] = obj.reactions.object;
        return map;
      }, {});
      return Promise.resolve(result)
    })
  }

  comments().then(response => {
    const reactionsPromise = reactions(response.object.map((comment) => comment.id))
    return Promise.all([Promise.resolve(response), reactionsPromise])
  }).then((response) => {
    const commentsResponse: HTTPResponse<Comment[]> = response[0]
    const reactionsResponse = response[1]
    const commentsWithReactions = commentsResponse.object.map((comment) => {
      return {
        ...comment,
        reactions: reactionsResponse[comment.id]
      }
    })
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.status(commentsResponse.status)
    res.json(commentsWithReactions)
  })
}

const owner = process.env.ONLY_OWNER
const githubToken = process.env.GITHUB_ACCESS_TOKEN
const appRunner = (port: number, app: express.Express = express(), handler: RequestHandler = commentsHandler(githubGet, owner, githubToken)) => {
  app.set("port", port)
  app.get("/repos/:owner/:repo/issues/:number/comments", handler)
  app.get("/", (request, res) => {
    res.send("It's working!")
  })
  app.listen(app.get("port"), () => {
    console.log(`Started server at http://localhost:${process.env.PORT || 5000}`)
  })
}
export default appRunner


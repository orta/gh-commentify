// @ts-check
import fetch, { RequestInit, Response } from "node-fetch"
import parseLinkHeader from "./link-header"

export interface GitHubInterface {
  request: (path: string, method: string) => Promise<Response>
  requestUrl: (url: string, method: string) => Promise<Response>
  paginate: (response: Response, previous: object[]) => Promise<object[]>
}

const GitHub = (githubToken: string, fetchFn = fetch) => {
  const request = async (path: string, method: string) => {
    const ghUrl = "https://api.github.com"
    return requestUrl([ghUrl, path].join("/"), method)
  }

  const requestUrl = async (url: string, method: string) => {
    const requestParams = {
      method: method,
      headers: {
        Accept: "application/vnd.github.squirrel-girl-preview+json, application/vnd.github.v3.html+json",
        Authorization: "token " + githubToken,
      },
    }
    return fetchFn(url, requestParams)
  }

  const paginate = async (response: Response, previous: object[]) => {
    const responseObject = response
    let next: string | null
    const linkHeader = responseObject.headers["Link"]
    if (linkHeader != null) {
      next = parseLinkHeader(linkHeader)["next"]
    }

    const collected = previous.concat(await responseObject.json())
    if (next == null) {
      return collected
    } else {
      return paginate(await requestUrl(next, "GET"), collected)
    }
  }

  return {
    request: request,
    requestUrl: requestUrl,
    paginate: paginate,
  }
}
export { GitHub }

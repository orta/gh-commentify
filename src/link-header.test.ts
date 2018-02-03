import parseLinkHeader from "./link-header"

describe("parseLinkHeader", () => {
  it("should return the correct object", () => {
    const header =
      '<https://api.github.com/search/code?q=addClass+user%3Amozilla&page=2>; rel="next", <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=34>; rel="last"'
    const got = parseLinkHeader(header)
    expect(got["next"]).toEqual("https://api.github.com/search/code?q=addClass+user%3Amozilla&page=2")
  })

  it("should return null if the header is nul", () => {
    expect(parseLinkHeader(null)).toBeNull()
  })
})

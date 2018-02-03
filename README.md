# gh-commentify

A repo you can use to work-around GH issue comment request limits by hosting your own server that makes authenticated requests on your behalf. You can find out more [in this blog post](http://artsy.github.io/blog/2017/07/15/Comments-are-on/)

It provides:

* The same comment route as GH's API `/repos/:owner/:repo/issues/:number/comments`
* Is locked to one org by default.
* Handles cross-domain requests
* Paginates under-the-hood for you, so you make one request
* Embeds comment Reactions into the request for you

The JSON looks like this:

```json
[
   {
    "url": "https://api.github.com/repos/artsy/artsy.github.io/issues/comments/315774939",
    "html_url": "https://github.com/artsy/artsy.github.io/issues/364#issuecomment-315774939",
    "issue_url": "https://api.github.com/repos/artsy/artsy.github.io/issues/364",
    "id": 315774939,

    "user": {
      "login": "grantjbutler",
      "id": 526054,
      "avatar_url": "https://avatars1.githubusercontent.com/u/526054?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/grantjbutler",
      "html_url": "https://github.com/grantjbutler",
      "followers_url": "https://api.github.com/users/grantjbutler/followers",
      "following_url": "https://api.github.com/users/grantjbutler/following{/other_user}",
      "gists_url": "https://api.github.com/users/grantjbutler/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/grantjbutler/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/grantjbutler/subscriptions",
      "organizations_url": "https://api.github.com/users/grantjbutler/orgs",
      "repos_url": "https://api.github.com/users/grantjbutler/repos",
      "events_url": "https://api.github.com/users/grantjbutler/events{/privacy}",
      "received_events_url": "https://api.github.com/users/grantjbutler/received_events",
      "type": "User",
      "site_admin": false
    },
    "created_at": "2017-07-17T14:38:14Z",
    "updated_at": "2017-07-17T14:38:14Z",
    "author_association": "NONE",
    "body": "This is an interesting system you've built to handle comments. Do you foresee any problems with using Github Issues for comments while also using Github Issues for issue tracking? Or do you think just having the label \"Comment Thread\" and using Github's filtering is sufficient for separating the two and keeping things organized?\r\n\r\nAdditionally, were there any surprises that came up when implementing this system? For example, needing to support some kind of content of a comment (maybe an attached file?) and styling it correctly that didn't cross your mind when first implementing this.",

    "body_html": "<p>Having comments on GH issues also made it really easy to hook up to a slack channel - so that I can use my normal stream-based flow of issue management. <g-emoji class=\"g-emoji\" alias=\"tada\" fallback-src=\"https://assets-cdn.github.com/images/icons/emoji/unicode/1f389.png\" ios-version=\"6.0\">🎉</g-emoji></p>\n<p><a href=\"https://user-images.githubusercontent.com/49038/28278078-dd0e0040-6ae9-11e7-9ca7-a35d245a52c4.png\" target=\"_blank\"><img src=\"https://user-images.githubusercontent.com/49038/28278078-dd0e0040-6ae9-11e7-9ca7-a35d245a52c4.png\" alt=\"screen shot 2017-07-17 at 12 16 37\" style=\"max-width:100%;\"></a></p>",

    "reactions": {
      "url": "https://api.github.com/repos/artsy/artsy.github.io/issues/comments/315774939/reactions",
      "total_count": 0,
      "+1": 0,
      "-1": 0,
      "laugh": 0,
      "hooray": 0,
      "confused": 0,
      "heart": 0
    }
  },
  { ... }
]
```

# Front-End

This is only a server, you're expected to write your own front-end. 

If you're looking for an awesome all-in-one solution for using issues on static pages, check out https://utteranc.es

# Setup

1. Make a GitHub [personal access token](https://github.com/settings/tokens) for the server to use. It only needs `public_repo` if you have an public repo for comment. Otherwise, use `repo`.

2. Click: [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/orta/gh-commentify)

After that, you are done, pretty simple.

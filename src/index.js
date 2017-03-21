import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";
import { Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";
import SessionStore from "./stores/session";
import ViewStore from "./stores/view";
import GithubApp from "./ui/githubApp";
import GithubAPI from "./api/github";
import RepoStore from "./stores/repo";
import IssueStore from "./stores/issue";
import "./index.css";

// wire up dependencies
const githubAPI = new GithubAPI({
  userToken: "ef8a80dd6f229f7cfe7bad7e126a79fff39003d1"
});
//75ca222a9bce7ea552b604a6d806b33103053326
const sessionStore = new SessionStore({ githubAPI });
const viewStore = new ViewStore();
const repoStore = new RepoStore({ githubAPI, sessionStore });
const issueStore = new IssueStore({ githubAPI, sessionStore });
//state wird in stores geteilt und werden initialisiert

// render the whole application
// provider is a kind of dependency injection system
function renderApp() {
  ReactDOM.render(
    <div>
      <DevTools position={{ bottom: 0, right: 10 }} />
      <Provider sessionStore={sessionStore} viewStore={viewStore} repoStore={repoStore} issueStore={issueStore}>
        <GithubApp />
      </Provider>
    </div>,
    document.getElementById("root")
  );
}

// callback for MOBX to indicate a rerender
autorun(renderApp);

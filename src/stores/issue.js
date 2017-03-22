import { extendObservable, action, when} from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";
//like in other stores
import { observer, inject, Provider } from "mobx-react";

export default class IssueStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      postIssue: action("postIssue", (repo, title, text) => {
        return githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text,
        });
      }),
      //taken from fetchRepos in stores/repo.js
      issueDeferred: new Map(),
      fetchIssues: action("fetchIssues", (repo) => {
        console.log("repo which should be fetched:", repo)//true
      //  console.log("has:", this.issueDeferred.has(repo))
        console.log("authenticated?",sessionStore.authenticated)
        console.log("issue deferred:",this.issueDeferred)
        console.log("state",this.issueDeferred.state)
       when(
          // condition
          () =>
            sessionStore.authenticated && //true
            (this.issueDeferred === null ||
              this.issueDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.issueDeferred = fromPromise(
              githubAPI.fetchIssues({
                login: userDeferred.value,
                repo
              })
            );
          }
        );
      }),
    //TODO: make issue editable
    editIssue: action("editIssue", (repo, title, text, cnt) => {
      return githubAPI.editIssue({
        login: sessionStore.userDeferred.value.login,
        repo,
        title,
        text,
        cnt
      });
    }),
  });
  }
}

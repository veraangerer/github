import { extendObservable, action } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";
//like in other stores

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
      issueDeferred: new Map(),
      //taken from fetchRepos in stores/repo.js
      fetchIssues: action("fetchIssues", (repo) => {
        console.log("repo which should be fetched:", repo) //true
        console.log("has:", this.issueDeferred.has(repo))
        console.log("authenticated?",sessionStore.authenticated)
        console.log("issue deferred:",this.issueDeferred)
        //console.log("state",this.issueDeferred.get(repo).state)
      /*  when(  () => {
          return sessionStore.authenticated &&
          (!this.issueDeferred.has(repo) ||
          this.issueDeferred.has(repo) &&
          this.issueDeferred.get(repo).state === REJECTED)
        },
        () => {
          const userDeferred = sessionStore.userDeferred;
          this.issueDeferred.set(repo, fromPromise(
            githubAPI.fetchIssues(userDeferred.value, repo)
          ));
        }
      );*/
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

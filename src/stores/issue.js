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
      //TODO: make issue editable
    /*  editIssue: action("editIssue", (repo, title, text) => {
        return githubAPI.editIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text,
          cnt
          //maybe add counter later to show all issues per repo
        });
      }),
      */
      issueDeferred: new Map(),
      //taken from fetchRepos in stores/repo.js
      fetchIssues: action("fetchIssues", (repo) => {
        console.log(this.issueDeferred.has(repo))
      // when(

        /*  () => {
              //return sessionStore.authenticated &&
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
        *///);
      })
    });
  }
}

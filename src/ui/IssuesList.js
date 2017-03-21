//extract IssueList to show issues per repo
import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
//copied code from repositoryList changed repoStore to issueStore
export default inject("issueStore", "sessionStore", "viewStore")(
  observer(
    class IssueList extends React.Component {
      constructor({ issueStore, repo, sessionStore }) {
        super();
        repoStore.fetchIssues();
      }

      renderIssuesList() {
        const {sessionStore, repoStore, viewStore, repo} = this.props;
        if (sessionStore.authenticated) {
          const issueDeferred = issueStore.issueDeferred.get(repo);
          const state = repoDeferred.state;
          switch (state) {
            case PENDING: {
              return <Spinner />;
            }
            case REJECTED: {
              return // errormessage
            }
            case FULFILLED: {
              const issues = issueDeferred.value;
              return (
                  issues.map((issues) => {
                    return
                     <h3
                      key={issues.id}
                      onClick={() => viewStore.push(viewStore.routes.issue({repo, id: issue.cnt}))}>
                        {issues.title}
                    </h3>
                  })
              )
              break;
            }
            default: {
              console.error("deferred state not supported", state);
            }
          }
        } else {
          return <h1>NOT AUTHENTICATED</h1>;
        }
      }
      render() {
        return (
          <div>
            <h1>List of Issues</h1>
            {this.renderIssuesList()}
          </div>
        );
      }
    }
  )
);

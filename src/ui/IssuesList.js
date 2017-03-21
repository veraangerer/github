//extract IssueList to show issues per repo
import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import Spinner from "@blueprintjs/core";
//copied code from repositoryList changed repoStore to issueStore
export default inject("issueStore", "sessionStore", "viewStore")(
  observer(
    class IssueList extends React.Component {
      constructor({ issueStore, repo, sessionStore }) {
        super();
        issueStore.fetchIssues();
      }

      renderIssuesList() {
        const {sessionStore, issueStore, viewStore, repo} = this.props;
        if (sessionStore.authenticated) {
          const issueDeferred = issueStore.issueDeferred.get(repo);
          const state = issueDeferred.state;
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
                  return(
                    <h3
                      key={issues.id}
                      onClick={() => viewStore.push(viewStore.routes.issue({repo, id: issues.cnt}))}>
                      {issues.title}
                    </h3>
                  );
                })
              )
              //break;
            }
            default: {
              console.error("deferred state not supported", state);
            }
          }
        }
        else {
          return <p style={{color: 'red'}}>an error occured, please check if you are logged in</p>;
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

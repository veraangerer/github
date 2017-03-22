//extract IssueList to show issues per repo
import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import Spinner from "@blueprintjs/core";
//copied code from repositoryList changed repoStore to issueStore
export default inject("issueStore", "sessionStore", "viewStore")(
  observer(
    class IssuesList extends React.Component {
      constructor({ issueStore, repo, sessionStore, route}) {
        super();
        issueStore.fetchIssues(repo);
        console.log(issueStore.fetchIssues(repo))
      }

      renderIssuesList() {
        const {sessionStore, issueStore, viewStore, route, repo} = this.props;
        if (sessionStore.authenticated) {
        //  issueStore.fetchIssues(repo);
        // const issueDeferred = issueStore.issueDeferred.get(repo);
          const issueDeferred = issueStore.issueDeferred;
          const state = issueDeferred.state;
          console.log("issueDeferred", issueDeferred);
        //  console.log("route:", route)
          console.log("issueDeferred state on render",issueDeferred.state)
          switch (state) {
            case PENDING: {
              return <Spinner />;
            }
            case FULFILLED: {
              const issues = issueDeferred.value;
              return (
                issues.map((issues) => {
                  return(
                    <div>
                      <h3 key={issues.id}>
                        {issues.title}
                      </h3>
                      <p>{issues.text}</p>
                      <button onClick={() => viewStore.push(viewStore.routes.issue({repo, id: issues.cnt}))} />
                    </div>
                  );
                })
              )
              //  break;
            }
            case REJECTED: {
              return <p style={{color: 'red'}}>something went wrong</p>;
              }
              default: {
                console.error("deferred state not supported", state);
              }
            }
          }
          else {
            return <p style={{color: 'red'}}>an error occured, please check if you are logged in</p>
          }
        }

        render() {
          //const {route} = this.props;
          return (
            <div>
              <h2>List of issues</h2>
              {this.renderIssuesList()}
            </div>
          );
        }
      }
    )
  );

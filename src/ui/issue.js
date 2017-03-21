//moved codebase from repositorylist to render form and issuelist afterwards
import React from "react";
import { observer, inject, Provider } from "mobx-react";
import FULFILLED from "mobx-utils";
import IssueForm from './IssueForm';
import IssuesList from './IssuesList';


export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route }) {
        super();
        const repo = route.params.repo;
        issueStore.fetchIssues(repo);
      }

      getFormValues() {
        const {issueStore, route} = this.props;
        const cnt = route.params.id;
        const repo = route.params.repo;

        if(cnt && issueStore.issueDeferred.has(repo)) {
          const issueDeferred = issueStore.issueDeferred.get(repo);
          const state = issueDeferred.state;
          switch(state) {
            /*case PENDING: {
            return <Spinner />;
            } //not sure if needed*/
            case FULFILLED: {
              const issue = issueDeferred.value.find((is) => {
                return is.cnt === cnt;
              })
              return <IssueForm route={route} key={cnt} values={{
                  "title": issue.title,
                  "text": issue.body
                }} />
              }
            }
          } else {
            return <IssueForm route={route}/>
          }
        }

        render() {
          const {route} = this.props;
          return (
            <Provider>
              <div>
                {this.getFormValues()}
                <IssuesList repo={route.params.repo}/>
              </div>
            </Provider>
          );
        }
      }
    )
  );

  //<IssueForm route={route} values={this.getFormValues()} />

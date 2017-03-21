import React from "react";
import { observer, inject } from "mobx-react";

function authenticated(Component){
  return inject ("repoStore", "sessionStore")(
  observer(function({sessionStore}) {
    if(sessionStore.authenticated){
      return <Component/>;
    }
    else{
      return null;
      }
    })
  );
}

export default inject("repoStore", "sessionStore")(
    observer(function({sessionStore}) {
        if (sessionStore.authenticated) {
            const currentUser = (window.currentUser = sessionStore.currentUser); return (
                <div>
                    <h3>User: {currentUser.login}</h3>
                    <p>Mail: {currentUser.email}</p>
                    <p>Followers: {currentUser.followers}</p>
                </div>
            );
        } else {
            return null;
        }
      })
);

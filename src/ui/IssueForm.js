//extract issueForm to make it editable
import MobxReactForm from "mobx-react-form";
import React from "react";
import { observer, Provider, inject } from "mobx-react";
import { extendObservable } from "mobx";
import { fromPromise } from "mobx-utils";
import { Button, Intent, Toaster, Position } from "@blueprintjs/core";
import validatorjs from "validatorjs";
import FormInput from './formInput';

const plugins = { dvr: validatorjs };

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Issue Title",
    rules: "required|string|between:5,10"
  },
  {
    name: "text",
    label: "Text",
    placeholder: "Issue Description",
    rules: "required|string|between:5,25"
  }
];

class IssueForm extends MobxReactForm {
  constructor(fields, options, issueStore, repo, cnt) {
    super(fields, options);
    this.issueStore = issueStore;
    this.cnt = cnt; //for updates
    this.repo = repo;

    extendObservable(this, {
      issuePostDeferred: fromPromise(Promise.resolve())
    });
  }

  onSuccess(form) {
    const { title, text } = form.values();
    let resultPromise = this.issueStore.postIssue(this.repo, title, text, this.cnt);
    resultPromise
    .then(() => Toaster.create({ position: Position.TOP }).show({
      message: "issue posted",
      intent: Intent.SUCCESS
    }))
    .catch(() => Toaster.create({ position: Position.TOP }).show({
      message: "failed posting issue",
      action: { text: "retry", onClick: () => form.submit() },
      intent: Intent.DANGER
    }));
    this.issuePostDeferred = fromPromise(resultPromise);
  }
}

const FormComponent = inject("form")(
  observer(function({ form }) {
    return (
      <form onSubmit={form.onSubmit}>

        <FormInput form={form} field="title" value="vera" />
        <FormInput form={form} field="text" />

        {form.issuePostDeferred.case({
          pending: () => <Button type="submit" loading={true} text="submit" />,
        rejected: () => (
          <Button type="submit" className="pt-icon-repeat" text="submit" />
        ),
        fulfilled: () => (
          <Button type="submit" onClick={form.onSubmit} text="submit" />
        )
      })}
      <Button onClick={form.onClear} text="clear" />
      <Button onClick={form.onReset} text="reset" />

      <p>{form.error}</p>
    </form>
  );
})
);

export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route, values }) {
        super();
        const repo = route.params.id;
        const fillParams = { fields } //options
        console.log("fillparams:",fillParams)
        console.log("show values:", values)
        this.state = {
          //https://github.com/johann-sonntagbauer/github/commit/2dc2fc9d19ca29d41564c81d02af6e25d45ab8fe
          form: new IssueForm(fillParams, {plugins}, issueStore,  route.params.id)
        };
      }
      render() {
        const { form } = this.state;
        const { route } = this.props;

        return (
          <Provider form={form}>
            <div>
              <h3>Create issue in {route.params.repo}</h3>
              {console.log(route.params.id)}
              <FormComponent />
            </div>
          </Provider>
        );
      }
    }
  )
);

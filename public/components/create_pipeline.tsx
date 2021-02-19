import {
  EuiButton,
  EuiCodeEditor,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiTitle
} from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { CoreDeps } from './app';
import 'brace/ext/language_tools';
import 'brace/mode/json';

export function CreatePipeline(props: CoreDeps) {
  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Instant on Integrations',
      },
      {
        text: 'Pipelines',
        href: '#/pipelines',
      },
      {
        text: 'Create pipeline',
        href: '#/pipelines/create',
      },
    ]);
  }, []);

  const template = {
    description: 'sample pipeline description',
    version: 1,
    processors: [
      {
        set: {
          field: 'foo',
          value: 'bar',
        },
      },
    ],
    on_failure: [
      {
        set: {
          field: 'error.message',
          value: '{{ failure_message }}',
        },
      },
    ],
  };
  const [rawPipeline, setRawPipeline] = useState(JSON.stringify(template, null, 4));
  const [pipelineId, setPipelineId] = useState('');

  const putPipeline = () => {
    props.http
      .put(`../api/instant_on_integrations/pipeline/${pipelineId}`, {
        body: rawPipeline,
      })
      .then((res) => {
        props.notifications.toasts.addSuccess(`success: ${res.acknowledged}`);
      })
      .catch((error) =>
        props.notifications.toasts.addError(error, { title: 'Error creating pipeline' })
      );
  };

  return (
    <>
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Create pipeline</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiFieldText
                    fullWidth
                    placeholder="Enter pipeline ID"
                    value={pipelineId}
                    onChange={(e) => setPipelineId(e.target.value)}
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton onClick={putPipeline} isDisabled={!pipelineId}>
                    Create
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer />
              <EuiCodeEditor
                mode="json"
                width="100%"
                height="25rem"
                value={rawPipeline}
                onChange={setRawPipeline}
                setOptions={{
                  fontSize: '14px',
                  enableBasicAutocompletion: true,
                  enableSnippets: true,
                  enableLiveAutocompletion: true,
                }}
                onBlur={() => {}}
                aria-label="Code Editor"
              />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
}

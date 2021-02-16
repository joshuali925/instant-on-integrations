import {
  EuiButton,
  EuiButtonIcon,
  EuiCodeBlock,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { CoreStart } from 'kibana/public';
import React, { useEffect, useState } from 'react';
import { PipelineType } from '../types';

export function PipelinesView(props: {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}) {
  const [pipelines, setPipelines] = useState<Array<PipelineType>>([]);
  const [query, setQuery] = useState('');
  const [selectedPipelines, setSelectedPipelines] = useState<Array<PipelineType>>([]);
  const [modal, setModal] = useState(<div />);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getPipelines();
  }, []);

  const getPipelines = () => {
    props.http
      .get('../api/instant_on_integrations/pipeline')
      .then((res) => {
        setPipelines(Object.keys(res.pipelines).map((id) => ({ ...res.pipelines[id], id })));
      })
      .catch((error) =>
        props.notifications.toasts.addError(error, { title: 'Error getting pipelines' })
      );
  };

  const putPipeline = () => {
    props.http
      .put(`../api/instant_on_integrations/pipeline/${query}`, {
        body: JSON.stringify({
          processors: [
            {
              set: {
                field: 'foo',
                value: 'bar',
              },
            },
          ],
        }),
      })
      .then((res) => {
        props.notifications.toasts.addSuccess(`success: ${res.acknowledged}`);
      })
      .then(() => getPipelines())
      .catch((error) =>
        props.notifications.toasts.addError(error, { title: 'Error creating pipeline' })
      );
  };

  const deletePipeline = () => {
    props.http
      .delete(`../api/instant_on_integrations/pipeline/${query}`)
      .then((res) => {
        props.notifications.toasts.addSuccess(`success: ${res.acknowledged}`);
      })
      .then(() => getPipelines())
      .catch((error) =>
        props.notifications.toasts.addError(error, { title: 'Error deleting pipeline' })
      );
  };

  const tableColumns = [
    {
      field: 'id',
      name: 'Pipeline ID',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'id',
      name: 'View',
      sortable: true,
      truncateText: true,
      render: (id: string, record: PipelineType) => (
        <EuiButtonIcon
          iconType="inspect"
          onClick={() => {
            setModal(
              <EuiOverlayMask onClick={() => setIsModalVisible(false)}>
                <EuiModal onClose={() => setIsModalVisible(false)} style={{ width: 800 }}>
                  <EuiModalHeader>
                    <EuiModalHeaderTitle>{id}</EuiModalHeaderTitle>
                  </EuiModalHeader>
                  <EuiModalBody>
                    <EuiCodeBlock language="json" fontSize="m" isCopyable>
                      {JSON.stringify(record, null, 2)}
                    </EuiCodeBlock>
                  </EuiModalBody>
                  <EuiModalFooter>
                    <EuiButton onClick={() => setIsModalVisible(false)} fill>
                      Close
                    </EuiButton>
                  </EuiModalFooter>
                </EuiModal>
              </EuiOverlayMask>
            );
            setIsModalVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      {isModalVisible && modal}
      <EuiPage restrictWidth="1000px">
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="l">
              <h1>Instant-on Integrations PoC</h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiFlexGroup gutterSize="m">
                <EuiFlexItem>
                  <EuiFieldText
                    fullWidth
                    placeholder="Pipeline Id"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton type="primary" onClick={getPipelines}>
                    Refresh
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton type="primary" onClick={putPipeline} isDisabled={!query}>
                    Put pipeline
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton type="primary" onClick={deletePipeline} isDisabled={!query}>
                    Delete pipeline
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer />
              <EuiInMemoryTable
                items={pipelines}
                itemId="id"
                columns={tableColumns}
                tableLayout="auto"
                pagination={{
                  initialPageSize: 10,
                  pageSizeOptions: [8, 10, 13],
                }}
                sorting={{
                  sort: {
                    field: 'id',
                    direction: 'asc',
                  },
                }}
                allowNeutralSort={false}
                isSelectable={true}
                selection={{
                  onSelectionChange: (items) => setSelectedPipelines(items),
                }}
              />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
}

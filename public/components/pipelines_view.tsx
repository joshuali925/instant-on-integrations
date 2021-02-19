import {
  EuiButton,
  EuiButtonIcon,
  EuiCodeBlock,
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
import React, { useEffect, useState } from 'react';
import { PipelineType } from '../types';
import { CoreDeps } from './app';

export function PipelinesView(props: CoreDeps) {
  const [pipelines, setPipelines] = useState<Array<PipelineType>>([]);
  const [selectedPipelines, setSelectedPipelines] = useState<Array<PipelineType>>([]);
  const [modal, setModal] = useState(<div />);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Instant on Integrations',
      },
      {
        text: 'Pipelines',
        href: '#/pipelines',
      },
    ]);
    getPipelines();
  }, []);

  const getPipelines = () => {
    props.http
      .get('../api/instant_on_integrations/pipeline')
      .then((res) => {
        setPipelines(Object.keys(res.pipelines).map((id) => ({ id, pipeline: res.pipelines[id] })));
      })
      .catch((error) =>
        props.notifications.toasts.addError(error, { title: 'Error getting pipelines' })
      );
  };

  const deletePipeline = () => {
    selectedPipelines
      .map((pipeline: PipelineType) => () =>
        props.http.delete(`../api/instant_on_integrations/pipeline/${pipeline.id}`)
      )
      .reduce((chain, func) => chain.then(func), Promise.resolve())
      .then(() => props.notifications.toasts.addSuccess(`deleted`))
      .then(() => getPipelines())
      .catch((error) =>
        props.notifications.toasts.addError(error, { title: 'Error deleting pipeline' })
      );
  };

  const showPipelineModal = (pipeline: PipelineType) => {
    setModal(
      <EuiOverlayMask onClick={() => setIsModalVisible(false)}>
        <EuiModal onClose={() => setIsModalVisible(false)} style={{ width: 800 }}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>{pipeline.id}</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiCodeBlock language="json" fontSize="m" isCopyable>
              {JSON.stringify(pipeline.pipeline, null, 2)}
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
          aria-label="inspect"
          iconType="inspect"
          onClick={() => showPipelineModal(record)}
        />
      ),
    },
  ];

  return (
    <>
      {isModalVisible && modal}
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiTitle size="l">
                <h1>Instant-on Integrations PoC</h1>
              </EuiTitle>
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
                search={{
                  toolsRight: [
                    <EuiButton type="primary" onClick={getPipelines} key="refresh-button">
                      Refresh
                    </EuiButton>,
                    <EuiButton
                      type="primary"
                      onClick={() => location.assign('#/pipelines/create')}
                      key="create-button"
                    >
                      Create pipeline
                    </EuiButton>,
                    <EuiButton
                      type="primary"
                      onClick={deletePipeline}
                      isDisabled={!selectedPipelines.length}
                      key="delete-button"
                    >
                      Delete pipeline
                    </EuiButton>,
                  ],
                  box: {
                    incremental: true,
                  },
                }}
              />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
}

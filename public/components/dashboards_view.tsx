import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { CoreStart } from 'kibana/public';
import React, { useEffect } from 'react';
import { SAVED_OBJECTS } from '../constants';
import { CoreDeps } from './app';

export function DashboardsView(props: CoreDeps) {
  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Instant on Integrations',
      },
      {
        text: 'Dashboards',
        href: '#/dashboards',
      },
    ]);
  }, []);

  const onAddIndexPattern = () => {
    props.http
      .post('../api/saved_objects/index-pattern', {
        body: JSON.stringify({
          attributes: {
            title: 'kibana_sample_data_flights',
            timeFieldName: 'timestamp',
          },
        }),
      })
      .then((res) => {
        console.log(res);
        props.notifications.toasts.addSuccess(`Index pattern added, id: ${res.id}`);
      });
  };

  const onAddVis = () => {
    const formData = new FormData();
    const file = new File([SAVED_OBJECTS], 'export.ndjson', {
      type: '',
    });
    formData.append('file', file);
    props.http
      .post('../api/saved_objects/_import', {
        body: formData,
        headers: {
          'Content-Type': undefined,
        },
        query: { createNewCopies: true },
      })
      .then((res) => {
        console.log(res);
        props.notifications.toasts.addSuccess(`success: ${res}`);
      });
  };
  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiButton type="primary" size="s" onClick={onAddIndexPattern}>
            Add index pattern
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton type="primary" size="s" onClick={onAddVis}>
            Add visualizations and dashboards
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}

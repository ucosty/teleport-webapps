/*
Copyright 2019 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import { useKubes, State } from './useKubes';
import Table, { Cell } from 'design/DataTable';
import { Label, ButtonBorder } from 'design';
import * as types from 'teleterm/ui/services/clusters/types';

export default function Container() {
  const state = useKubes();
  return <KubeList {...state} />;
}

function KubeList(props: State) {
  const { kubes = [], pageSize = 100, connect } = props;

  return (
    <Table
      data={kubes}
      columns={[
        {
          key: 'name',
          headerText: 'Name',
          isSortable: true,
        },
        {
          key: 'labelsList',
          headerText: 'Labels',
          render: renderLabelCell,
        },
        {
          altKey: 'connect-btn',
          render: kube => renderConnectButtonCell(kube.uri, connect),
        },
      ]}
      emptyText="No Kubernetes Clusters Found"
      pagination={{ pageSize, pagerPosition: 'bottom' }}
    />
  );
}

export const renderConnectButtonCell = (
  uri: string,
  connect: (kubeUri: string) => void
) => {
  return (
    <Cell align="right">
      <ButtonBorder
        size="small"
        onClick={() => {
          connect(uri);
        }}
      >
        Connect
      </ButtonBorder>
    </Cell>
  );
};

const renderLabelCell = ({ labelsList }: types.Kube) => {
  const labels = labelsList.map(l => `${l.name}:${l.value}`);
  const $labels = labels.map(label => (
    <Label mb="1" mr="1" key={label} kind="secondary">
      {label}
    </Label>
  ));

  return <Cell>{$labels}</Cell>;
};
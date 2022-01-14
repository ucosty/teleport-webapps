/*
Copyright 2020-2021 Gravitational, Inc.
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
import {
  FeatureBox,
  FeatureHeader,
  FeatureHeaderTitle,
} from 'teleport/components/Layout';
import { Indicator, Text, Box, Flex, Link, Alert, ButtonPrimary, MenuItem, Menu } from 'design';
import ResourceEditor from 'teleport/components/ResourceEditor';
import useResources from 'teleport/components/useResources';
import EmptyList from './EmptyList';
import ConnectorList from './ConnectorList';
import DeleteConnectorDialog from './DeleteConnectorDialog';
import useAuthConnectors, { State } from './useAuthConnectors';
import templates from './templates';
import { CarrotDown } from 'design/Icon';

export default function Container() {
  const state = useAuthConnectors();
  return <AuthConnectors {...state} />;
}

export function AuthConnectors(props: State) {
  const { attempt, github_items, oidc_items, saml_items, remove, save } = props;
  const items = [...github_items, ...oidc_items, ...saml_items];
  const isEmpty = items.length === 0;
  const resources = useResources(items, templates);

  const title =
    resources.status === 'creating'
      ? "Creating a new ${kind} connector"
      : "Editing ${kind} connector";

  function handleOnSave(content: string) {
    const isNew = resources.status === 'creating';
    return save(resources.item.kind, content, isNew);
  }

  return (
    <FeatureBox>
      <FeatureHeader>
        <FeatureHeaderTitle>Auth Connectors</FeatureHeaderTitle>
        <NewConnectorButton handler={resources.create} />
      </FeatureHeader>
      {attempt.status === 'failed' && <Alert children={attempt.statusText} />}
      {attempt.status === 'processing' && (
        <Box textAlign="center" m={10}>
          <Indicator />
        </Box>
      )}
      {attempt.status === 'success' && (
        <Flex alignItems="start">
          {isEmpty && (
            <Flex mt="4" width="100%" justifyContent="center">
              <EmptyList onCreate={() => resources.create('github')} />
            </Flex>
          )}
          {!isEmpty && (
            <>
              <ConnectorList
                items={items}
                onEdit={resources.edit}
                onDelete={resources.remove}
              />
              <Box
                ml="4"
                width="240px"
                color="text.primary"
                style={{ flexShrink: 0 }}
              >
                <Text typography="h6" mb={3} caps>
                  Authentication Connectors
                </Text>
                <Text typography="subtitle1" mb={3}>
                  Authentication connectors allow Teleport to authenticate users
                  via an external identity source such as Okta, Active
                  Directory, GitHub, etc. This authentication method is
                  frequently called single sign-on (SSO).
                </Text>
                <Text typography="subtitle1" mb={2}>
                  Please{' '}
                  <Link
                    color="light"
                    href="https://goteleport.com/docs/admin-guide/#github-oauth-20"
                    target="_blank"
                  >
                    view our documentation
                  </Link>{' '}
                  on how to configure a GitHub connector.
                </Text>
              </Box>
            </>
          )}
        </Flex>
      )}
      {(resources.status === 'creating' || resources.status === 'editing') && (
        <ResourceEditor
          title={title.replace('${kind}', resources.item.kind)}
          onSave={handleOnSave}
          text={resources.item.content}
          name={resources.item.name}
          isNew={resources.status === 'creating'}
          onClose={resources.disregard}
        />
      )}
      {resources.status === 'removing' && (
        <DeleteConnectorDialog
          name={resources.item.name}
          onClose={resources.disregard}
          onDelete={() => remove(resources.item.kind, resources.item.name)}
        />
      )}
    </FeatureBox>
  );
}

function renderMenuItem(resource: any, name: string, kind: string) {
    return (
        <MenuItem ml="auto" width="240px" onClick={() => resource.handler(kind)}>{name}</MenuItem>
    );
}

class ConnectorCreateButton extends React.Component {
    anchorEl = null;

    state = {
        open: false,
    };

    onOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        this.setState({ open: true });
      };

      onClose = () => {
        this.setState({ open: false });
      };

    render() {
        const { open } = this.state;
        const { children } = this.props;
        return (
          <>
           <ButtonPrimary
            ml="auto"
            width="240px"
            size="medium"
            setRef={e => (this.anchorEl = e)}
            onClick={this.onOpen}
            >
              CREATE CONNECTOR
              <CarrotDown ml={2} mr={-2} fontSize="2" color="text.secondary" />
            </ButtonPrimary>
            <Menu
              getContentAnchorEl={null}
              menuListCss={menuListCss}
              anchorEl={this.anchorEl}
              open={open}
              onClose={this.onClose}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              {open && this.renderItems(children)}
            </Menu>
          </>
        );
      }

      renderItems(children) {
        const filtered = React.Children.toArray(children);
        const cloned = filtered.map((child: React.ReactElement) => {
          return React.cloneElement(child, {
            onClick: this.makeOnClick(child.props.onClick),
          });
        });

        return cloned;
      }

      makeOnClick(cb) {
        return e => {
          e.stopPropagation();
          this.onClose();
          cb && cb(e);
        };
      }

}

const menuListCss = () => `
min-width: 240px;
`;

function NewConnectorButton(handler: any) {
    const $items = [] as React.ReactNode[];
    $items.push(renderMenuItem(handler, 'Github', 'github'));
    $items.push(renderMenuItem(handler, 'OpenID Connect', 'oidc'));
    $items.push(renderMenuItem(handler, 'SAML', 'saml'));

    return (
        <ConnectorCreateButton children={$items} />
    );
  }

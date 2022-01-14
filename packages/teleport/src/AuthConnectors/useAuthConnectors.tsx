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

import { useEffect, useState } from 'react';
import useAttempt from 'shared/hooks/useAttemptNext';
import { Resource } from 'teleport/services/resources';
import useTeleport from 'teleport/useTeleport';

export default function useAuthConnectors() {
  const ctx = useTeleport();
  const [github_items, setItems] = useState<Resource<'github'>[]>([]);
  const [oidc_items, setOidcItems] = useState<Resource<'oidc'>[]>([]);
  const [saml_items, setSamlItems] = useState<Resource<'saml'>[]>([]);
  const { attempt, run } = useAttempt('processing');

  function fetchData() {
    ctx.resourceService.fetchOIDCConnectors().then(response => {
        setOidcItems(response);
    });
    ctx.resourceService.fetchSAMLConnectors().then(response => {
        setSamlItems(response);
    });
    return ctx.resourceService.fetchGithubConnectors().then(response => {
      setItems(response);
    });
  }

  function save(type: string, yaml: string, isNew: boolean) {
    if(type === 'github') {
        return save_github(yaml, isNew);
    }

    if(type === 'oidc') {
        return save_oidc(yaml, isNew);
    }

    if(type === 'saml') {
        return save_saml(yaml, isNew);
    }
  }

  function save_github(yaml: string, isNew: boolean) {
    if (isNew) {
        return ctx.resourceService.createGithubConnector(yaml).then(fetchData);
      }
      return ctx.resourceService.updateGithubConnector(yaml).then(fetchData);
  }

  function save_oidc(yaml: string, isNew: boolean) {
    if (isNew) {
        return ctx.resourceService.createOIDCConnector(yaml).then(fetchData);
      }
      return ctx.resourceService.updateOIDCConnector(yaml).then(fetchData);
  }

  function save_saml(yaml: string, isNew: boolean) {
    if (isNew) {
        return ctx.resourceService.createSAMLConnector(yaml).then(fetchData);
      }
      return ctx.resourceService.updateSAMLConnector(yaml).then(fetchData);
  }

  function remove(type: string, name: string) {
    if(type === 'github') {
        return ctx.resourceService.deleteGithubConnector(name).then(fetchData);
    }

    if(type === 'oidc') {
        return ctx.resourceService.deleteOIDCConnector(name).then(fetchData);
    }

    if(type === 'saml') {
        return ctx.resourceService.deleteSAMLConnector(name).then(fetchData);
    }
  }

  useEffect(() => {
    run(() => fetchData());
  }, []);

  return {
    github_items,
    oidc_items,
    saml_items,
    attempt,
    save,
    remove,
  };
}

export type State = ReturnType<typeof useAuthConnectors>;

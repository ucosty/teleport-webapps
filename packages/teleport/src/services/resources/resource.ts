import api from 'teleport/services/api';
import cfg from 'teleport/config';
import { makeResource, makeResourceList } from './';

class ResourceService {
  fetchTrustedClusters() {
    return api
      .get(cfg.getTrustedClustersUrl())
      .then(res => makeResourceList<'trusted_cluster'>(res));
  }

  fetchGithubConnectors() {
    return api
      .get(cfg.getGithubConnectorsUrl())
      .then(res => makeResourceList<'github'>(res));
  }

  fetchOIDCConnectors() {
    return api
      .get(cfg.getOIDCConnectorsUrl())
      .then(res => makeResourceList<'oidc'>(res));
  }

  fetchRoles() {
    return api
      .get(cfg.getRolesUrl())
      .then(res => makeResourceList<'role'>(res));
  }

  createTrustedCluster(content: string) {
    return api
      .post(cfg.getTrustedClustersUrl(), { content })
      .then(res => makeResource<'trusted_cluster'>(res));
  }

  createRole(content: string) {
    return api
      .post(cfg.getRolesUrl(), { content })
      .then(res => makeResource<'role'>(res));
  }

  createGithubConnector(content: string) {
    return api
      .post(cfg.getGithubConnectorsUrl(), { content })
      .then(res => makeResource<'github'>(res));
  }

  createOIDCConnector(content: string) {
    return api
      .post(cfg.getOIDCConnectorsUrl(), { content })
      .then(res => makeResource<'oidc'>(res));
  }


  updateTrustedCluster(content: string) {
    return api
      .put(cfg.getTrustedClustersUrl(), { content })
      .then(res => makeResource<'trusted_cluster'>(res));
  }

  updateRole(content: string) {
    return api
      .put(cfg.getRolesUrl(), { content })
      .then(res => makeResource<'role'>(res));
  }

  updateGithubConnector(content: string) {
    return api
      .put(cfg.getGithubConnectorsUrl(), { content })
      .then(res => makeResource<'github'>(res));
  }

  updateOIDCConnector(content: string) {
    return api
      .put(cfg.getOIDCConnectorsUrl(), { content })
      .then(res => makeResource<'oidc'>(res));
  }

  deleteTrustedCluster(name: string) {
    return api.delete(cfg.getTrustedClustersUrl(name));
  }

  deleteRole(name: string) {
    return api.delete(cfg.getRolesUrl(name));
  }

  deleteGithubConnector(name: string) {
    return api.delete(cfg.getGithubConnectorsUrl(name));
  }

  deleteOIDCConnector(name: string) {
    return api.delete(cfg.getOIDCConnectorsUrl(name));
  }
}

export default ResourceService;

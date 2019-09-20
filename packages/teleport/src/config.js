/*
Copyright 2015 Gravitational, Inc.

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

import { generatePath } from 'react-router';
import { merge } from 'lodash';

const cfg = {
  baseUrl: window.location.origin,

  dateTimeFormat: 'MM/DD/YYYY HH:mm:ss',

  dateFormat: 'DD/MM/YYYY',

  auth: {},

  canJoinSessions: true,

  clusterName: 'localhost',

  proxyClusterName: '',

  routes: {
    app: '/web',
    account: '/web/account',
    cluster: '/web/cluster/:clusterId',
    clusterAccount: '/web/cluster/:clusterId/account',
    clusterAudit: '/web/cluster/:clusterId/audit',
    clusterNodes: '/web/cluster/:clusterId/nodes',
    clusterSessions: '/web/cluster/:clusterId/sessions',
    clusterOffline: '/web/cluster/:siteId/offline',
    console: '/web/cluster/:clusterId/console',
    consoleConnect: '/web/cluster/:clusterId/console/node/:serverId/:login',
    consolePlayer: '/web/cluster/:clusterId/console/player/:sid',
    consoleSession: '/web/cluster/:clusterId/console/session/:sid',
    error: '/web/msg/error/:type?',
    login: '/web/login',
    loginFailed: '/web/msg/error/login_failed',
    loginSuccess: '/web/msg/info/login_success',
    userInvite: '/web/newuser/:token',
    userReset: '/web/reset/:token',
  },

  api: {
    clustersPath: '/v1/webapi/sites',
    clusterEventsPath: `/v1/webapi/sites/:clusterId/events/search?from=:start?&to=:end?&limit=:limit?`,
    scp:
      '/v1/webapi/sites/:clusterId/nodes/:serverId/:login/scp?location=:location&filename=:filename',
    renewTokenPath: '/v1/webapi/sessions/renew',
    sessionPath: '/v1/webapi/sessions',
    userContextPath: '/v1/webapi/sites/:clusterId/context',
    userStatusPath: '/v1/webapi/user/status',
    invitePath: '/v1/webapi/users/invites/:inviteToken',
    userTokenInviteDonePath: '/v1/webapi/users',
    changeUserPasswordPath: '/v1/webapi/users/password',
    u2fCreateUserChallengePath: '/v1/webapi/u2f/signuptokens/:inviteToken',
    u2fCreateUserPath: '/v1/webapi/u2f/users',
    u2fSessionChallengePath: '/v1/webapi/u2f/signrequest',
    u2fChangePassChallengePath: '/v1/webapi/u2f/password/changerequest',
    u2fChangePassPath: '/v1/webapi/u2f/password',
    u2fSessionPath: '/v1/webapi/u2f/sessions',
    nodesPath: '/v1/webapi/sites/:clusterId/nodes',
    siteSessionPath: '/v1/webapi/sites/:siteId/sessions',
    sessionEventsPath: '/v1/webapi/sites/:siteId/sessions/:sid/events',
    siteEventSessionFilterPath: `/v1/webapi/sites/:siteId/sessions`,
    siteEventsFilterPath: `/v1/webapi/sites/:siteId/events?event=session.start&event=session.end&from=:start&to=:end`,
    ttyWsAddr:
      'wss://:fqdm/v1/webapi/sites/:clusterId/connect?access_token=:token&params=:params',
    terminalSessionPath: '/v1/webapi/sites/:clusterId/sessions/:sid?',
  },

  getClusterEventsUrl({ start, end, limit }) {
    const clusterId = cfg.clusterName;
    return generatePath(cfg.api.clusterEventsPath, {
      clusterId,
      start,
      end,
      limit,
    });
  },

  getAuthProviders() {
    return cfg.auth && cfg.auth.providers ? cfg.auth.providers : [];
  },

  getAuth2faType() {
    return cfg.auth ? cfg.auth.second_factor : null;
  },

  getSsoUrl(providerUrl, providerName, redirect) {
    return cfg.baseUrl + generatePath(providerUrl, { redirect, providerName });
  },

  getDefaultRoute() {
    const clusterId = cfg.proxyCluster;
    return generatePath(cfg.routes.cluster, { clusterId });
  },

  getAuditRoute() {
    const clusterId = cfg.clusterName;
    return generatePath(cfg.routes.clusterAudit, { clusterId });
  },

  getDashboardRoute() {
    return cfg.routes.app;
  },

  getNodesRoute() {
    const clusterId = cfg.clusterName;
    return generatePath(cfg.routes.clusterNodes, { clusterId });
  },

  getSessionsRoute() {
    const clusterId = cfg.clusterName;
    return generatePath(cfg.routes.clusterSessions, { clusterId });
  },

  getConsoleConnectRoute({ clusterId, login, serverId, sid }) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.routes.consoleConnect, {
      clusterId,
      serverId,
      login,
      sid,
    });
  },

  getClusterRoute(clusterId) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.routes.cluster, { clusterId });
  },

  getConsoleSessionRoute({ clusterId, sid }) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.routes.consoleSession, { clusterId, sid });
  },

  getConsolePlayerRoute({ clusterId, sid }) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.routes.consolePlayer, { clusterId, sid });
  },

  getUserUrl(clusterId) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.api.userContextPath, { clusterId });
  },

  getTerminalSessionUrl({ clusterId, sid } = {}) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.api.terminalSessionPath, { clusterId, sid });
  },

  getClusterNodesUrl(clusterId) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.api.nodesPath, { clusterId });
  },

  getU2fCreateUserChallengeUrl(inviteToken) {
    return generatePath(cfg.api.u2fCreateUserChallengePath, { inviteToken });
  },

  getClusterSessionsUrl(clusterId) {
    clusterId = clusterId || cfg.clusterName;
    return generatePath(cfg.api.se, { clusterId });
  },

  getScpUrl({ clusterId, serverId, login, location, filename }) {
    return generatePath(cfg.api.scp, {
      clusterId,
      serverId,
      login,
      location,
      filename,
    });
  },

  setClusterId(clusterId) {
    cfg.clusterName = clusterId || cfg.proxyCluster;
  },

  init(newConfig = {}) {
    merge(this, newConfig);
  },
};

export default cfg;
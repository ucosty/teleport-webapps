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

import { Store } from 'shared/libs/stores';
import { Participant } from 'teleport/services/ssh';

type Parties = Record<string, Participant[]>;

export default class StoreParties extends Store<Parties> {
  state: Parties = {};

  setParties(parties: Parties) {
    this.setState(parties);
  }

  bySid(sid: string) {
    return this.state[sid] || [];
  }
}
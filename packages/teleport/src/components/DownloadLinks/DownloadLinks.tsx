/**
 * Copyright 2022 Gravitational, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Box, Link } from 'design';
import getDownloadLink from 'teleport/services/links';
import useTeleport from 'teleport/useTeleport';

export default function DownloadLinks({ version }: Props) {
  const ctx = useTeleport();
  const isEnterprise = ctx.isEnterprise;

  return (
    <Box>
      <Link
        href={getDownloadLink('mac', version, isEnterprise)}
        target="_blank"
        mr="2"
      >
        MacOS
      </Link>
      <Link
        href={getDownloadLink('linux64', version, isEnterprise)}
        target="_blank"
        mr="2"
      >
        Linux 64-bit
      </Link>
      <Link
        href={getDownloadLink('linux32', version, isEnterprise)}
        target="_blank"
      >
        Linux 32-bit
      </Link>
    </Box>
  );
}

type Props = {
  version: string;
};

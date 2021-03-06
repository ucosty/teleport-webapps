import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from 'design';
import Popover from 'design/Popover';
import { useIdentity } from './useIdentity';
import { IdentityList } from './IdentityList/IdentityList';
import { IdentitySelector } from './IdentitySelector/IdentitySelector';
import { useKeyboardShortcuts } from 'teleterm/ui/services/keyboardShortcuts';
import { EmptyIdentityList } from './EmptyIdentityList/EmptyIdentityList';
import { getClusterName } from 'teleterm/ui/utils';

export function Identity() {
  const selectorRef = useRef<HTMLButtonElement>();
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const {
    activeRootCluster,
    rootClusters,
    changeRootCluster,
    logout,
    addCluster,
  } = useIdentity();

  const togglePopover = useCallback(() => {
    setIsPopoverOpened(wasOpened => !wasOpened);
  }, [setIsPopoverOpened]);

  function withClose<T extends (...args) => any>(
    fn: T
  ): (...args: Parameters<T>) => ReturnType<T> {
    return (...args) => {
      setIsPopoverOpened(false);
      return fn(...args);
    };
  }

  useKeyboardShortcuts(
    useMemo(
      () => ({
        'toggle-identity': togglePopover,
      }),
      [togglePopover]
    )
  );

  const loggedInUser = activeRootCluster?.loggedInUser;

  return (
    <>
      <IdentitySelector
        ref={selectorRef}
        onClick={togglePopover}
        isOpened={isPopoverOpened}
        userName={loggedInUser?.name}
        clusterName={getClusterName(activeRootCluster)}
      />
      <Popover
        open={isPopoverOpened}
        anchorEl={selectorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setIsPopoverOpened(false)}
        popoverCss={() => `max-width: min(560px, 90%)`}
      >
        <Container>
          {rootClusters.length ? (
            <IdentityList
              loggedInUser={loggedInUser}
              clusters={rootClusters}
              onSelectCluster={withClose(changeRootCluster)}
              onLogout={withClose(logout)}
              onAddCluster={withClose(addCluster)}
            />
          ) : (
            <EmptyIdentityList onConnect={withClose(addCluster)} />
          )}
        </Container>
      </Popover>
    </>
  );
}

const Container = styled(Box)`
  background: ${props => props.theme.colors.primary.light};
`;

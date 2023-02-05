import { forwardRef, ReactNode, Ref } from 'react';
import { Grid, Group, Portal, UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ContextMenuProps {
  children: ReactNode;
  maxWidth?: number;
  minWidth?: number;
  xPos: number;
  yPos: number;
}

const ContextMenuContainer = styled(motion.div)<Omit<ContextMenuProps, 'children'>>`
  position: absolute;
  top: ${({ yPos }) => yPos}px !important;
  left: ${({ xPos }) => xPos}px !important;
  z-index: 1000;
  min-width: ${({ minWidth }) => minWidth}px;
  max-width: ${({ maxWidth }) => maxWidth}px;
  background: var(--dropdown-menu-bg);
  box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 40%);
`;

export const StyledContextMenuButton = styled(UnstyledButton)`
  padding: 0.7rem 1rem;
  color: var(--dropdown-menu-fg);
  font-weight: 500;
  font-family: var(--content-font-family);
  text-align: left;
  background: var(--dropdown-menu-bg);
  border: none;
  cursor: default;

  & .mantine-Button-inner {
    justify-content: flex-start;
  }

  &:hover {
    background: var(--dropdown-menu-bg-hover);
  }

  &:disabled {
    background: transparent;
    opacity: 0.6;
  }
`;

export const ContextMenuButton = forwardRef(
  (
    {
      children,
      rightIcon,
      leftIcon,
      ...props
    }: UnstyledButtonProps &
      React.ComponentPropsWithoutRef<'button'> & {
        leftIcon?: ReactNode;
        rightIcon?: ReactNode;
      },
    ref: any,
  ) => {
    return (
      <StyledContextMenuButton
        {...props}
        key={props.key}
        ref={ref}
        as="button"
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <Grid>
          <Grid.Col
            span={2}
            sx={{ alignSelf: 'center' }}
          >
            {leftIcon}
          </Grid.Col>
          <Grid.Col span={8}>{children} </Grid.Col>
          <Grid.Col
            span={2}
            sx={{ alignSelf: 'center' }}
          >
            <Group
              align="flex-end"
              position="right"
            >
              {rightIcon}
            </Group>
          </Grid.Col>
        </Grid>
      </StyledContextMenuButton>
    );
  },
);

export const ContextMenu = forwardRef(
  ({ yPos, xPos, minWidth, maxWidth, children }: ContextMenuProps, ref: Ref<HTMLDivElement>) => {
    return (
      <Portal>
        <ContextMenuContainer
          ref={ref}
          maxWidth={maxWidth}
          minWidth={minWidth}
          xPos={xPos}
          yPos={yPos}
        >
          {children}
        </ContextMenuContainer>
      </Portal>
    );
  },
);

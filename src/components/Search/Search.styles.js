import styled from '@emotion/styled';

export const Image = styled('img')`
  order: ${props => props.order ? props.order : 'initial'};
  width: 100%;
  height: auto;
  padding: 4px 0;
`;
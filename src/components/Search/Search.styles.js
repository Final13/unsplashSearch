import styled from '@emotion/styled';

export default styled('div')`
  padding: 0 15px;
  
  @media (min-width: 576px){
    max-width: 540px;
    margin: auto;
    padding: 0;
  }

  @media (min-width: 768px){
    max-width: 720px;	
  }

  @media (min-width: 992px) {
    max-width: 960px;
  }

  @media (min-width: 1200px){
    max-width: 1140px;
  }
`;

export const Image = styled('img')`
  width: 100%;
  height: auto;
  margin: auto;
`;

export const ImageWrapper = styled('div')`
  line-height: 0;
  column-gap: 16px;
  grid-column-gap: 16px;
  grid-row-gap: 4px;
  column-count: 1;

  @media (min-width: 576px){
    column-count: 2;
  }

  @media (min-width: 768px){
    column-count: 3;
  }

  @media (min-width: 992px) {
    column-count: 4;
  }

  @media (min-width: 1200px){
    column-count: 5;
  }
`;

export const Input = styled('input')`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const Button = styled('button')`
  width: ${props => props.vote ? '100%' : '200px'};
  margin-left: ${props => props.vote ? '0' : '10px'};
  background-color: ${props => {
    if (props.vote === 'like') return '#ebf8df';
    if (props.vote === 'unlike') return '#f8dfe3';
    return '#f2f3fa';
  }};
  color: #4a4a4a;
  padding: 14px 20px;
  border: none;
  border-radius: ${props => props.vote ? '0 0 4px 4px' : '4px'};
  cursor: pointer;

  &:hover {
    background-color: ${props => {
      if (props.vote === 'like') return '#d6f8b6';
      if (props.vote === 'unlike') return '#f7c3cc';
      return '#eff0f5';
    }};
  
  }
`;

export const Form = styled('form')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;
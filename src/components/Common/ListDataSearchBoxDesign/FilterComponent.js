import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs((props) => ({
  type: "text",
  size: props.small ? 5 : undefined,
}))`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 2px solid #2ddc1b;
  padding: 0 32px 0 16px;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <Input
      id="search"
      type="text"
      placeholder="search"
      value={filterText}
      onChange={onFilter}
    />
  </>
);

export default FilterComponent;

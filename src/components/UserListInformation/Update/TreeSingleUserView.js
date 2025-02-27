import TreeSingleUserNode from "./TreeSingleUserNode";

const TreeSingleUserView = ({ updateDropdownList, updateMenuItem ,parentIds,singleUserData,setSingleUserData}) => {
    return (
      <div>
        {singleUserData?.map((node) => (
          <TreeSingleUserNode
          key={node.trackId} 
          node={node}
          parentIds={parentIds} 
          />
        ))}
      </div>
    );
  };

  export default TreeSingleUserView
import TreeNode from "./TreeNode";

const TreeView = ({
  data,
  clickedCheckboxes,
  setClickedCheckboxes,
  parentIds,
  isUpdate
}) => { 
  return (
    <div>
      {data?.map((node) => (
        <TreeNode
          key={node._id.$oid}
          node={node}
          clickedCheckboxes={clickedCheckboxes}
          setClickedCheckboxes={setClickedCheckboxes}
          parentIds={parentIds}
          isUpdate={isUpdate}
          data={data}
        />
      ))}
    </div>
  );
};

export default TreeView;

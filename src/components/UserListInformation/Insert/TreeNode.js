import React, { useEffect, useState } from "react";
import swal from "sweetalert";

const TreeNode = ({
  node,
  clickedCheckboxes,
  setClickedCheckboxes,
  parentIds,
  isUpdate,
 data
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxClick = (subNode,trackId, checked) => {

    const isDuplicate = clickedCheckboxes?.some(
      (check) => check?.itemId === subNode?._id
    );

    if (!isDuplicate) {
      if (clickedCheckboxes === undefined) {
        setClickedCheckboxes((prevData) => [
          ...prevData,
          { 
            childId: subNode?._id,
            isInserted: subNode.isInserted,
            isUpdated: subNode.isUpdated,
            isPDF: subNode.isPDF,
            isRemoved: subNode.isRemoved,
            isChecked: subNode.isChecked,
            parentIds: parentIds,
          },
        ]);
      } else {
        setClickedCheckboxes((prevData) => [
          ...prevData,
          {
            childId: subNode?._id,
            isInserted: subNode.isInserted,
            isUpdated: subNode.isUpdated,
            isPDF: subNode.isPDF,
            isRemoved: subNode.isRemoved,
            isChecked: checked,
            parentIds: parentIds,
          },
        ]);
      }

    }
  };

  return (
    <div style={{position: "relative", overflow: "auto"}}>
      <table className="table table-bordered">
        <tbody>
          <tr className="table-data-label">
            <td
              colSpan="2"
              style={{
                textAlign: "left",
                paddingLeft: "20px",
                background: "#2DDC1B",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleToggle}
            >
              {isOpen ? "-" : "+"} {node.label}
            </td>
          </tr>
          <tr></tr>
          {isOpen && node.items && (
            <>
              {node.items.map((subNode) =>
               (
                <tr key={subNode._id}>
                  <td>
                    {subNode.items?.length > 0 ? (
                      <TreeNode
                        node={subNode}
                        clickedCheckboxes={clickedCheckboxes}
                        setClickedCheckboxes={setClickedCheckboxes}
                        parentIds={[...parentIds, node._id]}
                        isUpdate={isUpdate}
                      />
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          id={`${subNode?._id}`}
                          // checked={subNode?.isChecked || false}
                          name="check"
                          className="form-check-input border-success checkbox-design me-2"
                          onClick={(e) => {
                            const { checked } = e.target;
                            if (checked) {
                              parentIds.push(node._id);
                    
                              handleCheckboxClick(subNode,node.trackId, checked);
                            } else {
                              const updatedData = clickedCheckboxes.filter(
                                (item) => item?.childId !== subNode?._id
                              );
                              setClickedCheckboxes(updatedData);
                            }
                          }}
                        />
                        <label className="input-label" htmlFor="">{subNode.label}</label>
                      </>
                    )}
                  </td>

                  {subNode?.items?.length > 0 ? (
                    ""
                  ) : (
                    <td className="d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <input
                          type="checkbox"
                          id={`${subNode?._id}`}
                          // checked={subNode?.isInserted || false}
                          className="form-check-input border-success me-2 checkbox-design"
                          // checked={clickedCheckboxes.findIndex(
                          //   (item) => item.itemId === subNode._id
                          // ) !== -1}
                          onClick={(e) => {
                           
                            const { checked } = e.target;
                            const indexes = clickedCheckboxes.findIndex(
                              (item) => item.childId === subNode._id
                            );

                            if (checked) {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                             
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isInserted"] = checked;
                                return tempDetails;
                              });
                            } else {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                return;
                              }

                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isInserted"] = checked;
                                return tempDetails;
                              });
                            }
                          }}
                        />
                        <label className="input-label" htmlFor="">Insert</label>
                      </div>
                      <div className="d-flex">
                        <input
                          type="checkbox"
                          // checked={subNode?.isUpdated || false}
                          className="form-check-input border-success checkbox-design me-2"
                          onClick={(e) => {
                            const { checked } = e.target;
                            const indexes = clickedCheckboxes.findIndex(
                              (item) => item.childId === subNode._id
                            );
                            if (checked) {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isUpdated"] = checked;
                                return tempDetails;
                              });
                            } else {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu name",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isUpdated"] = checked;
                                return tempDetails;
                              });
                            }
                          }}
                        />
                        <label className="input-label" htmlFor="">Update</label>
                      </div>
                      <div className="d-flex">
                        <input
                          type="checkbox"
                          // checked={subNode?.isRemoved || false}
                          className="form-check-input border-success checkbox-design me-2"
                          onClick={(e) => {
                            const { checked } = e.target;
                            const indexes = clickedCheckboxes.findIndex(
                              (item) => item.childId === subNode._id
                            );
                            if (checked) {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isRemoved"] = checked;
                                return tempDetails;
                              });
                            } else {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isRemoved"] = checked;
                                return tempDetails;
                              });
                            }
                          }}
                        />
                        <label className="input-label" htmlFor="">Delete</label>
                      </div>
                      <div className="d-flex">
                        <input
                          type="checkbox"
                          // checked={subNode?.isPDF || false}
                          className="form-check-input border-success checkbox-design me-2"
                          onClick={(e) => {
                            const { checked } = e.target;
                            const indexes = clickedCheckboxes.findIndex(
                              (item) => item.childId === subNode._id
                            );

                            if (checked) {
                              if (indexes === -1) {
                                swal(
                                  "Not possible",
                                  "Please select menu",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isPDF"] = checked;
                                return tempDetails;
                              });
                            } else {
                              if (indexes === -1) {
                                // Item does not exist in the array
                                swal(
                                  "Not possible",
                                  "Please select menu",
                                  "warning"
                                );
                                e.target.checked = false;
                                return;
                              }
                              setClickedCheckboxes((prev) => {
                                const tempDetails = [...prev];
                                tempDetails[indexes]["isPDF"] = checked;
                                return tempDetails;
                              });
                            }
                          }}
                        />
                        <label className="input-label" htmlFor="">PDF</label>
                      </div>
                    </td>
                  )}
                </tr>
              )
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TreeNode;

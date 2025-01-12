export default function handleCheckboxClick (dataItem,setSelectedData) {
    setSelectedData((prevSelectedData) => {
      if (prevSelectedData?.includes(dataItem)) {
        // Deselect the data item if it's already selected
        return prevSelectedData.filter((item) => item !== dataItem);
      } else {
        // Select the data item if it's not already selected
        return [...prevSelectedData, dataItem];
      }
    })
}

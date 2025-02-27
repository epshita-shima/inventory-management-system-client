import { createSlice } from "@reduxjs/toolkit"

const initialState={
  singleUser: null,
  menuItems: [],
  menulist:[]
}

const mergeMenus = (menuList, menuItemsList) => {
  const mergeItems = (menuItems, refItems) => {
    return refItems.map((refItem) => {
      const matchingItem = menuItems.find(
        (item) => item.id === refItem._id || item._id === refItem._id
      );
      return {
        ...refItem,
        _id: matchingItem ? matchingItem._id : refItem._id,
        id: refItem._id,
        items: mergeItems(matchingItem?.items || [], refItem.items || []),
        isChecked: matchingItem?.isChecked || false,
        isInserted: matchingItem?.isInserted || false,
        isRemoved: matchingItem?.isRemoved || false,
        isUpdated: matchingItem?.isUpdated || false,
        isPDF: matchingItem?.isPDF || false,
        parentIds: matchingItem?.parentIds || [],
      };
    });
  };

  return mergeItems(menuList, menuItemsList);
};

const updateDropdownList = (updatedChild, menuList) => {
  console.log(updatedChild);
  return menuList.map((item) => {
    console.log(item.trackId, updatedChild.trackId, updatedChild.isChecked);
    if ((item.id === updatedChild.trackId && item.isParent === true) || (item.id === updatedChild.parentIds)) {
      return {
        ...item,
        isChecked: updatedChild.isChecked ,
        items: updateDropdownListRecursive(updatedChild, item.items),
      };
    } else if (item.items && item.items.length > 0) {
      console.log("else");
      return {
        ...item,
        items: updateDropdownList(updatedChild, item.items),
        isChecked: item.items.some((child) => child.isChecked), // Ensure parent isChecked if any child is checked
      };
    }
    return item;
  });
};

const updateDropdownListRecursive = (updatedChild, dropdownList) => {
  console.log(updatedChild, dropdownList);
  return dropdownList.map((child) => {
    console.log(child._id, updatedChild._id)
    if (child._id === updatedChild._id) {
      return { ...child, ...updatedChild };
    } else if (child.items && child.items.length > 0) {
      const updatedItems = updateDropdownListRecursive(
        updatedChild,
        child.items
      );
      console.log(updatedItems);
      return {
        ...child,
        items: updatedItems,
        isChecked: updatedItems.some((subChild) => subChild.isChecked), // Ensure parent isChecked if any child is checked
      };
    }
    return child;
  });
};

const userUpdateSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSingleUser: (state, action) => {
      console.log(action.payload)
      state.singleUser = action.payload;
      state.menulist = action.payload?.menulist || [];
    },
    updateSingleUserField: (state, action) => {
      const { field, value } = action.payload;
      if (state.singleUser) {
        state.singleUser[field] = value;
      }
    },
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    mergeAndUpdateUserMenu: (state) => {
      
      if (state.singleUser && Array.isArray(state.singleUser.menulist)) {
        state.singleUser.menulist = mergeMenus(state.singleUser.menulist, state.menuItems);
        state.menulist = state.singleUser.menulist;
      }
    },
    updateMenuItem: (state, action) => {
      const updatedChild = action.payload;
      console.log(updatedChild)
      state.menulist = updateDropdownList(updatedChild, state.menulist);
      console.log(JSON.stringify(state.menulist, null, 2));
      if (state.singleUser) {
        state.singleUser.menulist = state.menulist;
      }
      
    },
    setMenuList: (state, action) => {
      state.menulist = action.payload;
    },
    filterCheckedMenuItems: (state) => {
      const filterCheckedItems = (data) =>
        data
          ?.filter((item) => item.isChecked)
          .map((item) => ({
            ...item,
            items: filterCheckedItems(item.items || []),
          }));

      if (state.singleUser && state.singleUser.menulist) {
        state.singleUser.menulist = filterCheckedItems(state.singleUser.menulist);
      }
    },
  }
})
export const { updateMenuItem, setMenuList,setSingleUser, setMenuItems, mergeAndUpdateUserMenu,updateSingleUserField ,filterCheckedMenuItems} = userUpdateSlice.actions;
export default userUpdateSlice.reducer;
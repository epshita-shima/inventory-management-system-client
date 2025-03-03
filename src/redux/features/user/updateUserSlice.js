import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  singleUser: null,
  menuItems: [],
  menulist: [],
};

const mergeMenus = (menuList, menuItemsList) => {
  console.log(menuList);
  console.log(menuItemsList);
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

const updateDropdownList = (updatedChild, menuList, currentState) => {
  return menuList.map((item) => {
    if (
      (item.id === updatedChild.trackId && item.isParent === true) ||
      item.id === updatedChild.parentIds
    ) 
    
    {
      const updatedItems = updateDropdownListRecursive(updatedChild, item.items);
      const allChecked = updatedItems.every(child => child.isChecked);
      const someChecked = updatedItems.some(child => child.isChecked);
      return {
        ...item,
        isChecked: allChecked ? true : someChecked ? true : false,
        items: updatedItems,
      };
    } else if (item.items && item.items.length > 0) {
      return {
        ...item,
        items: updateDropdownList(updatedChild, item.items, currentState),
        isChecked: item.items.some((child) => child.isChecked), // Ensure parent isChecked if any child is checked
      };
    }
    return item;
  });
};

const updateDropdownListRecursive = (updatedChild, dropdownList) => {
  return dropdownList.map((child) => {
    if (child._id === updatedChild._id) {
      return { ...child, ...updatedChild };
    } else if (child.items && child.items.length > 0) {
      const updatedItems = updateDropdownListRecursive(
        updatedChild,
        child.items
      );

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
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    setSingleUser: (state, action) => {
      state.singleUser = action.payload;
      if (state.singleUser && Array.isArray(state.singleUser.menulist)) {
        const updatedMenuList = mergeMenus(
          state.singleUser.menulist,
          state.menuItems
        );
        if (
          JSON.stringify(state.singleUser.menulist) !==
          JSON.stringify(updatedMenuList)
        ) {
          state.singleUser = {
            ...state.singleUser,
            menulist: updatedMenuList,
          };
          state.menulist = updatedMenuList;
        }
      }
    },

    updateSingleUserField: (state, action) => {
      const { field, value } = action.payload;
      if (state.singleUser) {
        state.singleUser[field] = value;
      }
    },

    updateMenuItem: (state, action) => {
      const updatedChild = action.payload;
      const newMenuList = updateDropdownList(
        updatedChild,
        state.menulist,
        state.singleUser.menulist
      );
      state.menulist = [...newMenuList];
      state.singleUser = {
        ...state.singleUser,
        menulist: [...newMenuList], // Ensuring a fresh reference for reactivity
      };
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
        state.singleUser.menulist = filterCheckedItems(
          state.singleUser.menulist
        );
      }
    },
  },
});
export const {
  updateMenuItem,
  setSingleUser,
  setMenuItems,
  updateSingleUserField,
  filterCheckedMenuItems,
} = userUpdateSlice.actions;
export default userUpdateSlice.reducer;

export const extractUserMenuListForCurrectMenu = (user, menuLabel) => {
console.log('user',user)
  const getUserId = localStorage.getItem("user");
  console.log('getUserId',getUserId)
  if (!getUserId) {
    return null; // Return null if no user is found in localStorage
  }

  const userSingleId = JSON.parse(getUserId);
  const userIdFromSession = userSingleId?._id;
console.log('userIdFromSession',userIdFromSession)
  // Filter the user data to find the current user
  const permidionData = user?.filter((user) => user._id === userIdFromSession);

  console.log('permidionData',permidionData)
  let userList = null;

  // Find the user object matching the provided userId
  const currentUser = permidionData?.find((user) => user._id === userIdFromSession);
  if (currentUser) {
    // Loop through the menus of the current user
    currentUser?.menulist?.forEach((menu) => {
      menu?.items?.forEach((subMenu) => {
        // Check if the subMenu matches the provided label
        if (subMenu?.label === subMenu?.label) {
          // Find the sub-item matching the dynamic label
          const userListSubMenu = subMenu?.items?.find(
            (subItem) => subItem?.label === menuLabel
          );
          if (userListSubMenu) {
            // Set the user list property
            userList = userListSubMenu;
          }
        }
      });
    });
  }

  return userList;
};

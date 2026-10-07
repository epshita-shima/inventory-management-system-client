export const getSessionUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const sanitizeUserForStorage = (user) => {
  if (!user || typeof user !== "object") {
    return user;
  }
  const { password, hashPassword, ...safeUser } = user;
  return safeUser;
};

const findMenuItemByLabel = (items, menuLabel) => {
  if (!items?.length) {
    return null;
  }
  for (const item of items) {
    if (item?.label === menuLabel) {
      return item;
    }
    const nested = findMenuItemByLabel(item?.items, menuLabel);
    if (nested) {
      return nested;
    }
  }
  return null;
};

export const extractUserMenuListForCurrectMenu = (userOrLabel, maybeLabel) => {
  const menuLabel =
    typeof userOrLabel === "string" && maybeLabel === undefined
      ? userOrLabel
      : maybeLabel;
  if (!menuLabel) {
    return null;
  }

  const sessionUser = getSessionUser();
  if (!sessionUser) {
    return null;
  }

  let currentUser = sessionUser;
  if (Array.isArray(userOrLabel)) {
    currentUser =
      userOrLabel.find((user) => user._id === sessionUser._id) || sessionUser;
  } else if (userOrLabel && typeof userOrLabel === "object" && userOrLabel.menulist) {
    currentUser = userOrLabel;
  }

  if (!currentUser?.menulist) {
    return null;
  }

  return findMenuItemByLabel(currentUser.menulist, menuLabel);
};

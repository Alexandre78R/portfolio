export const generateTabs = (num = 0): string => {
    let tabs = "\xA0\xA0";
    for (let i = 0; i < num; i++) {
      tabs += "\xA0";
    }
    return tabs;
};
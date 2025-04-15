export const saveToSessionStorage = (key: string, data: any) => {
    sessionStorage.setItem(key, JSON.stringify(data));
}

export const getFromSessionStorage = (key: string) => {
    return sessionStorage.getItem(key);
}

export const removeFromSessionStorage = (key: string) => {
    sessionStorage.removeItem(key);
}
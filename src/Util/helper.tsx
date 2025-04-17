export const saveToSessionStorage = (key: string, data: any) => {
    sessionStorage.setItem(key, JSON.stringify(data));
}

export const getFromSessionStorage = (key: string) => {
    return sessionStorage.getItem(key);
}

export const removeFromSessionStorage = (key: string) => {
    sessionStorage.removeItem(key);
}

export const saveFile = async (blob:any, fileName: string) => {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
};
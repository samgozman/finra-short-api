interface ISort {
    [key: string]: 'asc' | 'desc';
}

interface UnknownObject {
    [key: string]: any;
}

export function sortObjectsArray<T extends UnknownObject>(arr: T[], sort: ISort): T[] {
    const sortKey = Object.keys(sort)[0];
    if (sort[sortKey] === 'asc') {
        arr.sort((a: T, b: T) => (a[sortKey] > b[sortKey] ? 1 : -1));
    } else if (sort[sortKey] === 'desc') {
        arr.sort((a: T, b: T) => (a[sortKey] < b[sortKey] ? 1 : -1));
    }
    return arr;
}

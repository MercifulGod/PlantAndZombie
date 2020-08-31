
// let arr = [1, 2, 3, 4, 5, 6];
// this.removeByIndexes(arr, [0, 2]);
// console.log(arr); [2, 4, 5, 6]
export function removeByIndexes(arr, indexes) {
    for (let i = indexes.length - 1; i >= 0; i--) {
        arr.splice(indexes[i], 1);
    }
}
export function getInputData(inputList: Array<HTMLInputElement>) : Object {
    const inputData = {}
    inputList.forEach(input => {
        inputData[input.id] = input.value
        input.value = ''
    })

    return inputData
}
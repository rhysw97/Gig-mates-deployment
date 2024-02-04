
export async function postRequest(endpoint: string, data: any, auth: string ='') {
    const responseData = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
        },
       
        //sends as JSON string to backend
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    return responseData
}


export async function formPostRequest(endpoint: string, data: FormData) {
    const responseData = await fetch(`${endpoint}`, {
        method: 'POST',
       
        body: data
    })
    .then((response) => response.json())
    return responseData
}
export async function getRequest(endpoint: string, auth: string ='') {
    const responseData = await fetch(`${endpoint}`, 
    
    {
        method: 'GET',
        headers: {
            'Authorization': auth
        },
    }).then(response => response.json())
    return responseData
}
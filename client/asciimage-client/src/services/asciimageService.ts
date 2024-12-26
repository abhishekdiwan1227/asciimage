const serviceUrl = "http://localhost:3000"

export async function convertToAscii(file: File) {
    var body = new FormData()
    body.append("file", file)

    var url = `${serviceUrl}/ascii`
    var response = await fetch(url, { method: 'POST', body: body })

    if (!response.ok) {
        throw new Error(`Something went wrong. ${response.statusText}`);
    }

    return response.json()
}

export async function healthCheck() {

    var url = `${serviceUrl}/health-check`
    var response = await fetch(url)

    if(!response.ok)
    {
        throw new Error("Service unavailable")
    }

    return response.json()
}
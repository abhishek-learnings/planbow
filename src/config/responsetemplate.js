export const forbidden = (response, data) => {
    return response.status(403).send({
        error: true,
        message: "you are not authorized to perform this action",
        data: data || {},
        status:{
            code:403
        }
    })
}
export const internalServerError = (response, data) => {
    return response.status(500).send({
        error: true,
        message: "Internal Server Error",
        data: data || {},
        status:{
            code:500
        }
    })
}

export const success = (response, data) => {
    return response.status(200).send({
        error: false,
        message: "success",
        data: data || {},
        status:{
            code:200
        }
    })
}

export const badRequest = (response, data) => {
    return response.status(422).send({
        error: true,
        message: "Bad Request",
        data: data || {},
        status:{
            code:422
        }
    })
}
export const conflict = (response,data) => {
    return response.status(409).send({
        error: true,
        message: "conflict",
        data: data || {},
        status:{
            code:409
        }
    })
}
export const unAuthorized = (response, data) => {
    return response.status(401).send({
        error: true,
        message: "Invalid token",
        data: data || {},
        status:{
            code:401
        }
    })
}
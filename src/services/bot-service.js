import service from ".";

export const getDevices = async () => {
    try {
        const response = await service.get('/bot/clients');

        if (!response.data) return

        return response.data.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Create a new client.
 */
export const createDevice = async (id) => {
    try {
        const response = await service.post('/bot/connect/' + id);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Delete a client.
 */
export const deleteDevice = async (id) => {
    try {
        const response = await service.post('/bot/disconnect/' + id, {}, {
            params: {
                removeSession: true
            }
        });
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Get status of client.
 */
export const getStatus = async (id) => {
    try {
        const response = await service.get('/bot/status/' + id);

        if (!response.data) return

        return response.data.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Get QR image.
 */
export const getQrImage = (id) => {
    return '/api/bot/qr-image/' + id + '?q=' + (new Date()).getTime()
}

/**
 * Disconnect.
 */
export const disconnect = async (id) => {
    try {
        const response = await service.post('/bot/disconnect/' + id);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}
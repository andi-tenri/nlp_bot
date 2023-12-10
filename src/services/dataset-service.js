import service from ".";

export const getDataset = async () => {
    try {
        const response = await service.get('/dataset');
        return response.data.data;
    } catch (error) {
        console.log(error);
        return
    }
}

export const getUnansweredDataset = async () => {
    try {
        const response = await service.get('/unanswered');
        return response.data.data;
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Create a new dataset.
 * 
 */
export const createDataset = async (data) => {
    try {
        const response = await service.post('/dataset', data);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Update a dataset
 */
export const updateDataset = async (id, data) => {
    try {
        const response = await service.put(`/dataset/${id}`, data);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Delete a dataset
 */
export const deleteDataset = async (id) => {
    try {
        const response = await service.delete(`/dataset/${id}`);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * refresh model
 */
export const refreshModel = async () => {
    try {
        const response = await service.post('/dataset/refresh-model');
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

export const deleteUnanswered = async (id) => {
    try {
        const response = await service.delete('/unanswered/' + id);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Delete intent
 */
export const deleteIntent = async (intent) => {
    try {
        const response = await service.post(`/dataset/delete-intent`, { intent });
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Create intent
 */
export const createIntent = async (intent) => {
    try {
        const response = await service.post(`/dataset`, { intent });
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Update intent
 */
export const updateIntent = async (newIntent, oldIntent) => {
    try {
        const response = await service.post(`/dataset/update-intent`, { newIntent, oldIntent });
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}
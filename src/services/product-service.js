import service from ".";

export const getProducts = async () => {
    try {
        const response = await service.get("/product");
        return response.data;
    } catch (error) {
        console.log(error);
        return;
    }
}

export const createProduct = async (data) => {
    try {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        formData.append("name", data.name);
        const response = await service.post("/product", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return;
    }
}

export const updateProduct = async (id, data) => {
    try {
        const response = await service.put(`/product/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        return;
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await service.delete(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return;
    }
}
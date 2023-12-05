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
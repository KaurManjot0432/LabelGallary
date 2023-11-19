import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    images: [],
    token: null,
    user: null
}
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setImages: (state, action) => {
            state.images = action.payload.images;
        },
        setImage: (state: any, action) => {
            const updatedImage = state.images.map((image: any) => {
                if (image._id === action.payload.image._id) {
                    return action.payload.image;
                } else {
                    return image;
                }
            })
            state.images = updatedImage;
        },
        setDelete: (state, action) => {
            const updatedImages = state.images.filter((image: any) => {
                return image._id !== action.payload.image._id
            })
            state.images = updatedImages;
        }
    }
})
export const { setLogin, setLogout, setImage, setImages, setDelete } = authSlice.actions;
export default authSlice;
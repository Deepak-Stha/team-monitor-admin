import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    companyId:null,
    companyEmail:null,
    address:null,
    token:null
}

const authSlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanyInfo: (state, action) => {
            state.companyId = action.payload.companyId;
            state.companyEmail = action.payload.companyEmail;
            state.address = action.payload.address;
            state.token = action.payload.token;
        },
        updateCredentials:(state,action)=>{
            const {companyId,companyEmail,address} = action.payload;
            if(companyEmail){
                state.companyEmail = companyEmail;
            }
            if(address){
                state.address = address;
            }
            if(companyId){
                state.companyId = companyId;
            }
        },
        loggedOut: () => {
            return initialState;
        },
        tokenReceived: (state, action) => {
            const { accessToken } = action.payload;
            if (accessToken) {
              state.token = accessToken;
            }
        },
    },
})

export const { setCompanyInfo, loggedOut, updateCredentials,tokenReceived } = authSlice.actions;
export default authSlice.reducer
export const selectCurrentAuthUser = (state)=> state.company;
export const selectCurrentToken = (state) => state.company.token;
export const selectCurrentCompanyId = (state) => state.company.companyId;
export const selectCurrentCompanyEmail = (state) => state.company.companyEmail;
export const selectCurrentCompanyAddress = (state) => state.company.address;
export const selectIsLoggedIn = (state) => state.company.token !== null;

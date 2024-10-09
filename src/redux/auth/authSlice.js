import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    companyId:null,
    companyEmail:null,
    companyName:null,
    location:null,
    companyPhoneNumber:null,
    isApproved:false,
    isVerified:false,
    token:null
}

const authSlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanyInfo: (state, action) => {
            state.companyId = action.payload.companyId;
            state.companyEmail = action.payload.companyEmail;
            state.location = action.payload.location;
            state.token = action.payload.token;
            state.companyName = action.payload.companyName;
            state.companyPhoneNumber = action.payload.companyPhoneNumber;
            state.isApproved = action.payload.isApproved;
            state.isVerified = action.payload.isVerified;
        },
        updateCredentials:(state,action)=>{
            const {companyId,companyEmail,location, companyName, companyPhoneNumber, isApproved,isVerified, token} = action.payload;
            if(companyEmail){
                state.companyEmail = companyEmail;
            }
            if(location){
                state.location = location;
            }
            if(companyId){
                state.companyId = companyId;
            }
            if(companyName){
                state.companyName = companyName;
            }
            if(companyPhoneNumber){
                state.companyPhoneNumber = companyPhoneNumber;
            }
            if(isApproved){
                state.isApproved = isApproved;
            }
            if(isVerified){
                state.isVerified = isVerified;
            }
            if(token){
                state.token = token;
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
export const selectCurrentCompanyLocation = (state) => state.company.location;
export const selectIsLoggedIn = (state) => state.company.token !== null;

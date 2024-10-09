import { createContext, useState, useEffect, useContext, useRef } from "react";
import {io} from "socket.io-client";
import { url } from "./ApiURL";
import { useSelector } from "react-redux";
import { selectCurrentAuthUser } from "../redux/auth/authSlice";

const SocketContext = createContext();

export const useSocketContext =()=>{
    const context = useContext(SocketContext);
    if (context === undefined) {
		throw new Error("useSocketContext must be used within a SocketContextProvider");
	}
	return context;
}

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const socketRef = useRef(null);
    const authUser = useSelector(selectCurrentAuthUser)
    

    useEffect(() => {
        if (authUser && !socketRef.current) {
            const newSocket = io("http://localhost:8000", {
                query: {
                    userId: authUser.isApproved || authUser.isVerified ? `company_${authUser.companyId}` : authUser.employeeId,
                },
            });
              setSocket(newSocket);
            socketRef.current = socket;

            // Clean up the socket when the component unmounts or authUser changes
            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        } else if (!authUser && socketRef.current) {
            // Close socket when authUser becomes null
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, [authUser]);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
export default SocketContextProvider;

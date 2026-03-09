import React, {createContext, useState, useContext} from 'react';

const NotificationContext= createContext();
export const useNotification=()=>useContext(NotificationContext);

export function NotificationProvider({children}) {
  const [message, setMessage]= useState(null);

  const showMessage= (msg)=>{
    setMessage(msg);
    setTimeout(()=> setMessage(null), 3000);
  };

  return(
    <NotificationContext.Provider value={{showMessage}}>
      {children}
      {message && <div className="notification">{message}</div>}
    </NotificationContext.Provider>
  );
}
'use client';
import  { Sidebar } from "@/components/sidebar/Sidebar";
export default function sideBar() {


  return (
        <div>
           <Sidebar 
                user={ {id: "5",
                  name: "Frederick",
                  email: "fredi@email.com",
                  role: "adopter",
                }} 
                currentView={'welcome'} 
                onNavigate={(() => {})} 
                onLogout={(() => {})} 
            />
        </div>
        );

}
import React from "react";


export default function Header(){
    return(
        <div className="flex justify-between ">
            <h1 className="text-3xl font-Bold m-[1rem]">Buddy</h1>
            <div className="flex justify-end gap-4 m-[1rem] text-lg font-medium cursor-pointer">
                <nav>sign-in</nav>
                <nav>sign-up</nav>
                <nav>about</nav>
                <nav>contact</nav>

                
            </div>
        </div>
    );
}
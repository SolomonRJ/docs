import React from "react";

export default function Card(){
    return(
        <div className="flex row gap-4 justify-center flex-wrap hidden">
            <div className="w-[15rem] h-[20rem] bg-red-300 m-[2rem]"></div>
            <div className="w-[15rem] h-[20rem] bg-blue-300 m-[2rem]"></div>
            <div className="w-[15rem] h-[20rem] bg-green-300 m-[2rem]"></div>
            <div className="w-[15rem] h-[20rem] bg-yellow-300 m-[2rem]"></div>
            <div className="w-[15rem] h-[20rem] bg-purple-300 m-[2rem]"></div>
        </div>
    )
}
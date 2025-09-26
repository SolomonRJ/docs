import axios from 'axios';

export default function chunkText(text,chunksize=500){
    const chunks = [];
    for(let i=0;i<text.klength;i+= chunksize){
        chunks.push(text.slice(i,i+chunksize));
    }

    return chunks;

}

//gemini embedding api 

export async function getEmnbeddings(text){
    const Gemini_URL = "";
    const apikey = process.env.GEMINI_API_KEY;

    const response = await axios.post(Gemini_URL,{text},{
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${apikey}`
        }
    });
    return response.data.embeddings;
}


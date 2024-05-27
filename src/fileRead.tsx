import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: { 'OpenAI-Beta': 'assistants=v2' }
});

import * as FS from 'fs';
const path = require('path');


export async function readFile(fileIn: FS.PathLike) {
        const assistant = await openai.beta.assistants.create({
        name: "Financial Analyst Assistant",
        instructions: "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
        model: "gpt-4o",
        tools: [{ type: "file_search" }],
    });console.log(assistant.id)

    const fileData = await openai.files.create({
            file: FS.createReadStream(fileIn),
            purpose: "assistants",
        });

        let vectorStore = await openai.beta.vectorStores.create({
            name: "Test",
        });console.log(vectorStore.id)

        await openai.beta.vectorStores.files.createAndPoll(
            vectorStore.id,
            {
                file_id: fileData.id,
            }
        );console.log(fileData.id)

        await openai.beta.assistants.update(assistant.id, {
            tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
        });
}


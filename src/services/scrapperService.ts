import http from "https";
import * as contentService from "./contentService";

const options = {
  "method": "",
  "hostname": "api.browse.ai",
  "port": null,
  "path": "",
  "headers": {
    "Authorization": `Bearer ${process.env.BROWSE_AI_API_TOKEN}`
  }
};

export const runRobotTask = async (robotId: string, inputParameters: any) => {
  return await new Promise((resolve, reject) => {
    options.path = `/v2/robots/${robotId}/tasks`;
    options.method = "POST";

    const req = http.request(options, function (res) {
      const chunks: any[] = [];
  
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });
    
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);

        try {
          const data = JSON.parse(buffer.toString());
          resolve(data); // Retorna o JSON parseado
        } catch (error) {
          reject(new Error("Erro ao parsear JSON"));
        }
      });
    })

    req.on('error', (error) => {
      reject(error)
    })
  
    req.write(JSON.stringify(inputParameters));
    req.end();
  })
}

export const getRobotTask = async (robotId: string, taskId: any) => {
  return await new Promise((resolve, reject) => {
    options.path = `/v2/robots/${robotId}/tasks/${taskId}`;
    options.method = "GET";

    const req = http.request(options, function (res) {
      const chunks: any[] = [];
  
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });
    
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);

        try {
          const data = JSON.parse(buffer.toString());

          if (data?.result) {
            contentService.automaticallyCreateContent(data.result.capturedLists, data.result.inputParameters.search_text);
          }
          resolve(data);
        } catch (error) {
          reject(new Error("Erro ao parsear JSON"));
        }
      });
    })

    req.on('error', (error) => {
      reject(error)
    })
  
    req.end();
  })
}
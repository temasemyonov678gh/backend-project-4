import axios from 'axios';
import debug from 'axios-debug-log';
import Listr from 'listr';

debug.addLogger(axios);

export const getResponse = (link) => axios.get(link);
export const getResponsesOfLinks = (links) => {
  const arr = Object.values(links).flat();
  return arr.map(([link]) => {
    const task = new Listr([
      {
        title: link,
        task: () => getResponse(link),
      },
    ]);
    task.run().catch((err) => console.log(err));
    return getResponse(link);
  });
};
export const getData = (response) => response.data;

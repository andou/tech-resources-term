// // List of commands that require API calls

import { getProjects } from '../api';
import { getQuote } from '../api';
import { getReadme } from '../api';
import { getWeather } from '../api';
import { getIp } from '../api';
import { getTechLinks } from '../api';

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  return projects
    .map(
      (repo) =>
        `${repo.name} - <a class="text-light-blue dark:text-dark-blue underline" href="${repo.html_url}" target="_blank">${repo.html_url}</a>`,
    )
    .join('\n');
};

export const whereami = async (args: string[]): Promise<string> => {
  const ip = await getIp();
  return ` ${ip} `;
};

export const topics = async (args: string[]): Promise<string> => {
  const readme = await getTechLinks();
  var rx = /\n\#\#\# (.*)\n/g;
  //var arr = rx.exec(readme);
  var topics = readme.match(rx);
  console.log(topics);
  return topics
    .map(
      (topic) => (
        `- ${topic.replace('###', '').replace('\n', '')}`
      )
    )
    .join('').concat(' \nNow try \n$ ~ topic one_of_the_above');
};

export const topic = async (args: string[]): Promise<string> => {
  const topic = args.join(' ');
  const topicClass = args.join('\\+');

  const readme = await getTechLinks();
  var rx = new RegExp(`\#\#\# ${topic}\n((.|\n)*)class=\"${topicClass}`);
  var topics = readme.match(rx);
  console.log(rx);
  console.log(topics);
  if (topics !== null) {
    topics = topics[1]
      .replace('<div align="right"', '')
      .split('\n')
      .map(
        (topic) => {
          var matches = /\[(.*?)\]\((.+?)\)/g.exec(topic);

          if (matches !== null) {
            topic = topic.replace(matches[0], `<u><a href="${matches[2]}" target="_blank">${matches[1]}</a></u>`)
          }

          return topic
        }
      )
      .join('\n');


  } else {
    topics = "Topic not found";
  }
  console.log(topics)
  return topics;
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const readme = async (args: string[]): Promise<string> => {
  const readme = await getReadme();
  return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};

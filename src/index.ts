import * as core from '@actions/core';
// @ts-ignore
import fetch from 'node-fetch';
// import * as github from '@actions/github';

try {
  const nameToGreet = core.getInput('name-to-greets');
  console.log(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  core.setOutput('time', time);

  getDataFromUrl().then((res) => console.log(res));
} catch (error: any) {
  core.setFailed(error.message);
}

export async function getDataFromUrl(): Promise<ArrayBuffer> {
  let dataUrl =
    'https://cdn.jsdelivr.net/gh/cylynx/verifyml@main/examples/model_card_output/data/breast_cancer_diagnostic_model_card.proto';
  const res = await fetch(dataUrl);
  const arrBuffer = await res.arrayBuffer();
  return arrBuffer;
}

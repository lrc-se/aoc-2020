export interface InputPublic {
  load: (url: string) => Promise<string[]>;
}

async function load(url: string): Promise<string[]> {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.text();
    return data.replace(/\r?\n$/, "").split(/\r?\n/);
  } else {
    throw Error(response.statusText);
  }
}

export function useInput(): InputPublic {
  return { load };
}

export interface InputPublic {
  load: (url: string) => Promise<string[]>;
}

async function load(filename: string): Promise<string[]> {
  const response = await fetch(`${process.env.BASE_URL}inputs/${filename}`);
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

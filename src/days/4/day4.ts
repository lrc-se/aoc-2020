import { OutputPublic } from "@/functions/output";

const VALID_EYE_COLORS = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

enum PassportFieldType {
  BirthYear = "byr",
  IssueYear = "iyr",
  ExpirationYear = "eyr",
  Height = "hgt",
  HairColor = "hcl",
  EyeColor = "ecl",
  PassportID = "pid",
  CountryID = "cid"
}

type Passport = {
  [K in PassportFieldType]?: string;
};

function getPassportDefinitions(input: string[]): string[] {
  return input.join("\n").split("\n\n");
}

function parsePassport(definition: string): Passport {
  const passport: Passport = {};
  definition.split(/\s+/).forEach(field => {
    const [key, value] = field.split(":");
    passport[key as PassportFieldType] = value;
  });
  return passport;
}

function isPassportValid1(passport: Passport): boolean {
  const definedFields = Object.keys(passport);
  return Object.values(PassportFieldType)
    .every(field => field == PassportFieldType.CountryID || definedFields.includes(field));
}

function isPassportFieldValid(field: string, value = ""): boolean {
  let isValid;
  switch (field) {
    case PassportFieldType.BirthYear:
      isValid = (value >= "1920" && value <= "2002");
      break;
    case PassportFieldType.IssueYear:
      isValid = (value >= "2010" && value <= "2020");
      break;
    case PassportFieldType.ExpirationYear:
      isValid = (value >= "2020" && value <= "2030");
      break;
    case PassportFieldType.Height: {
      isValid = false;
      const match = /^(\d+)(\D+)$/.exec(value);
      if (match) {
        const height = +match[1];
        switch (match[2]) {
          case "cm":
            isValid = (height >= 150 && height <= 193);
            break;
          case "in":
            isValid = (height >= 59 && height <= 76);
            break;
        }
      }
      break;
    }
    case PassportFieldType.HairColor:
      isValid = /^#[0-9a-f]{6}$/.test(value);
      break;
    case PassportFieldType.EyeColor:
      isValid = VALID_EYE_COLORS.includes(value);
      break;
    case PassportFieldType.PassportID:
      isValid = /^\d{9}$/.test(value);
      break;
    default:
      isValid = true;
  }

  return isValid;
}

function isPassportValid2(passport: Passport): boolean {
  if (!isPassportValid1(passport)) {
    return false;
  }
  return Object.entries(passport).every(entry => isPassportFieldValid(...entry));
}

function runPuzzle(input: string[], validator: (passport: Passport) => boolean, output: OutputPublic) {
  const passports = getPassportDefinitions(input).map(parsePassport);
  const validCount = passports.filter(validator).length;
  output.print(`Valid passports: ${validCount}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      const passports = getPassportDefinitions(input).map(parsePassport);
      passports.forEach((passport, i) => {
        output.print(`Passport #${i + 1}: ${isPassportValid1(passport) ? "valid" : "invalid"}`);
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle(input, isPassportValid1, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      const passports = getPassportDefinitions(input).map(parsePassport);
      const invalidCount = passports.slice(0, 4).filter(passport => !isPassportValid2(passport)).length;
      const validCount = passports.slice(4).filter(isPassportValid2).length;
      output.print(`All invalid passports identified: ${invalidCount == 4}`);
      output.print(`All valid passports identified: ${validCount == 4}`);
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle(input, isPassportValid2, output);
    }
  };
}

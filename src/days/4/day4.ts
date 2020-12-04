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

interface PassportField {
  key: PassportFieldType;
  value: string;
}

type Passport = PassportField[];

function getPassportDefinitions(input: string[]): string[] {
  return input.join("\n").split("\n\n");
}

function parsePassport(definition: string): Passport {
  return definition.split(/\s+/).map(field => {
    const [key, value] = field.split(":");
    return { key: key as PassportFieldType, value };
  });
}

function isPassportValid1(passport: Passport): boolean {
  const definedFields = passport.map(field => field.key);
  return Object.values(PassportFieldType)
    .every(field => field == PassportFieldType.CountryID || definedFields.includes(field));
}

function isPassportFieldValid(field: PassportField): boolean {
  let isValid;
  switch (field.key) {
    case PassportFieldType.BirthYear:
      isValid = (field.value >= "1920" && field.value <= "2002");
      break;
    case PassportFieldType.IssueYear:
      isValid = (field.value >= "2010" && field.value <= "2020");
      break;
    case PassportFieldType.ExpirationYear:
      isValid = (field.value >= "2020" && field.value <= "2030");
      break;
    case PassportFieldType.Height: {
      isValid = false;
      const match = /^(\d+)(\D+)$/.exec(field.value);
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
      isValid = /^#[0-9a-f]{6}$/.test(field.value);
      break;
    case PassportFieldType.EyeColor:
      isValid = VALID_EYE_COLORS.includes(field.value);
      break;
    case PassportFieldType.PassportID:
      isValid = /^\d{9}$/.test(field.value);
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
  return passport.every(isPassportFieldValid);
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

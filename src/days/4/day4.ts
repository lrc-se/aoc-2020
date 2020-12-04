import { OutputPublic } from "@/functions/output";

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

function isPassportValid(passport: Passport): boolean {
  const definedFields = passport.map(field => field.key);
  return Object.values(PassportFieldType)
    .every(field => field == PassportFieldType.CountryID || definedFields.includes(field));
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      const passports = getPassportDefinitions(input).map(parsePassport);
      passports.forEach((passport, i) => {
        output.print(`Passport #${i + 1}: ${isPassportValid(passport) ? "valid" : "invalid"}`);
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      const passports = getPassportDefinitions(input).map(parsePassport);
      const validCount = passports.filter(isPassportValid).length;
      output.print(`Valid passports: ${validCount}`);
      output.print();
    }
  };
}

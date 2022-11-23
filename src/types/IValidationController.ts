export interface IValidationController {
  isAllValid(): boolean;
  isValid(id: string): boolean;
  validate(id: string, value: string): boolean;
}

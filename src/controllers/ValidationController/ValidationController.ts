import { IValidationController } from "../../types/IValidationController";
import { ValidationFn } from "../../types/ValidationFn";

export class ValidationController implements IValidationController {

  private valid;

  constructor(
    private readonly validators: { readonly [id: string]: ValidationFn }
  ) {
    this.valid = {} as { [P in keyof typeof validators]: boolean };
    Object.keys(validators).forEach(k => {
      this.valid[k] = false;
    });
  }

  isAllValid(): boolean {
    const vals = Object.values(this.valid) as boolean[];
    return vals.reduce((prev, curr) => curr && prev);
  }

  isValid(id: string): boolean {
    const result = this.valid[id];
    if (result === undefined) {
      throw new Error(`Unknown validator key: ${id}`);
    }
    return result;
  }
  
  validate(id: string, value: string): boolean {
    const validator = this.validators[id];
    if (validator === undefined) {
      throw new Error(`Unknown validator key: ${id}`);
    }
    const result = validator(value);
    this.valid[id] = result;
    return result;
  }

}

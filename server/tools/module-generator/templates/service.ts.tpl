// {{module}}.service.ts for {{module}} module
import { BaseService } from "../base/base.service";
import { {{Module}}Model } from "./{{module}}.schema";
import { I{{Module}} } from "./{{module}}.type";

export class {{Module}}Service extends BaseService<I{{Module}}> {
  constructor() {
    super({{Module}}Model);
  }
}

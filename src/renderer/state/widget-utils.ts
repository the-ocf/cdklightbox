import {
  EnumWidgetState,
  StaticFunctionWidgetState,
  WidgetState,
} from './states';
import { jsii } from '../jsii';

export function isStaticFunction(widgetState: StaticFunctionWidgetState) {
  return !!(widgetState.method && widgetState.parameters);
}

export function isEnum(widgetState: EnumWidgetState) {
  return !!(widgetState.method && widgetState.type === 'enum');
}

export function isConstruct(widgetState: WidgetState) {
  if ((widgetState as StaticFunctionWidgetState).type === 'staticFunction') {
    return false;
  }
  if ((widgetState as EnumWidgetState).type === 'enum') {
    return false;
  }
  const jsiiType = jsii.types[widgetState.forType];

  return !!(
    jsiiType.initializer?.parameters &&
    jsiiType.initializer?.parameters[0].type.fqn === 'constructs.Construct'
  );
}

export function isLooseObject(widgetState: WidgetState) {
  return (
    !isStaticFunction(widgetState as StaticFunctionWidgetState) &&
    !isEnum(widgetState as EnumWidgetState) &&
    !isConstruct(widgetState)
  );
}

export function getRef(key: string) {
  return `WIDGET#${key}`;
}

export enum WidgetTypeShape {
  LOOSE = 'LOOSE',
  STATIC_FUNCTION = 'STATIC_FUNCTION',
  ENUM = 'ENUM',
}

export function getKey(ref: string) {
  return ref.replace('WIDGET#', '');
}

export function isRef(key: string) {
  return key.startsWith('WIDGET#');
}

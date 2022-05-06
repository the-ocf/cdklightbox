import jsiiLibraries from './definitions/jsii.json';
import jsiiCore from './definitions/jsii2.json';
import jsiiConstructs from './definitions/jsii3.json';
// import allAwsCdk from './definitions/@aws-cdk/all.json';

export interface JsiiMetadata {
  types: Record<string, any>;
}

export function isConstruct(forType: any) {
  if (forType.initializer) {
    if (forType.initializer.parameters && forType.initializer.parameters[0]) {
      if (
        forType.initializer?.parameters[0].type.fqn === 'constructs.Construct'
      ) {
        return true;
      }
    }
  }
  return false;
}

const classNameRegex = /\.(\w*)/;

export function className(fqn: string) {
  const results = classNameRegex.exec(fqn);
  return (results && results.length && results[1]) || fqn;
}

export const endOf = (fqn: string) => fqn.replace(/(.*\.)/i, '');

export const getInitializerProps = (forType: any) => {
  if (
    forType.kind === 'interface' &&
    !forType.methods?.length &&
    forType.properties?.length
  ) {
    return forType.properties;
  }
  // if (forType.kind === 'class' && )
  if (!forType.initializer?.parameters) {
    return [];
  }
  if (
    forType.initializer.parameters[0] &&
    forType.initializer.parameters[0].type.fqn === 'constructs.Construct'
  ) {
    return jsii.types[forType.initializer.parameters[2].type.fqn];
  }
  if (forType.initializer.parameters[0].type.fqn) {
    return jsii.types[forType.initializer.parameters[0].type.fqn];
  }
  return forType.initializer.parameters;
};

const shortenRegex = /\/([a-z0-9-]*.\w*)/;

export function shorten(fqn: string) {
  const results = shortenRegex.exec(fqn);
  return (results && results.length && results[1].replace('aws-', '')) || fqn;
}

export const jsii: JsiiMetadata = {
  types: {
    ...jsiiLibraries.types,
    ...jsiiCore.types,
    ...jsiiConstructs.types,
    // ...allAwsCdk.types,
  },
};

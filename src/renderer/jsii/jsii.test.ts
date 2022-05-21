import { shorten } from './jsii';

describe('Shorten', () => {
  it('properly handles iam_role', () => {
    const shortened = shorten('aws-cdk-lib.aws_iam.Role');
    expect(shortened).toEqual('aws_iam.Role');
  });

  it('properly handles core.Stack', () => {
    const shortened = shorten('aws-cdk-lib.Stack');
    expect(shortened).toEqual('Stack');
  });
});

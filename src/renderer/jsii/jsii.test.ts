import { shorten } from './jsii';

describe('Shorten', () => {
  it('properly handles ec2.Instance', () => {
    const shortened = shorten('@aws-cdk/aws-ec2.Instance');
    expect(shortened).toEqual('ec2.Instance');
  });

  it('properly handles core.Stack', () => {
    const shortened = shorten('@aws-cdk/core.Stack');
    expect(shortened).toEqual('core.Stack');
  });
});
